import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { projectId, prdData, strukturData, tasksOutdated, appName, appIdea } = body;

    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    // Verify ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: session.user.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 404 });
    }

    const updateData: any = {};
    if (appName !== undefined) {
      updateData.appName = appName;

      // Update formInputs.appName if exists
      if (project.formInputs) {
        try {
          const formInputsObj = JSON.parse(project.formInputs);
          formInputsObj.appName = appName;
          updateData.formInputs = JSON.stringify(formInputsObj);
        } catch {}
      }

      // Update title in strukturData if exists and not explicitly passed
      if (project.strukturData && strukturData === undefined) {
        try {
          const strukturObj = JSON.parse(project.strukturData);
          strukturObj.title = appName;
          updateData.strukturData = JSON.stringify(strukturObj);
        } catch {}
      }
    }

    if (appIdea !== undefined) {
      updateData.appIdea = appIdea;

      // Update appIdea in formInputs if exists
      if (project.formInputs && appName === undefined) {
        try {
          const formInputsObj = JSON.parse(updateData.formInputs || project.formInputs);
          formInputsObj.appIdea = appIdea;
          updateData.formInputs = JSON.stringify(formInputsObj);
        } catch {}
      }
    }

    if (prdData !== undefined) {
      updateData.prdData = prdData;
      // Update redis cache for PRD
      try { await redis.set(`project:${projectId}:prd`, prdData); } catch (e) { console.warn("Redis PRD update error", e); }
    }

    if (strukturData !== undefined) {
      // Expecting raw JSON string or object
      const strukturStr = typeof strukturData === 'string' ? strukturData : JSON.stringify(strukturData);
      updateData.strukturData = strukturStr;
      // Update redis cache for Struktur
      try { 
        await redis.set(`project:${projectId}:struktur`, typeof strukturData === 'string' ? JSON.parse(strukturData) : strukturData); 
      } catch (e) { console.warn("Redis Struktur update error", e); }
    }

    if (body.taskStatus !== undefined) {
      const taskStatusStr = typeof body.taskStatus === 'string' ? body.taskStatus : JSON.stringify(body.taskStatus);
      updateData.checkedTasks = taskStatusStr;
      try {
        await redis.set(`project:${projectId}:taskStatus`, typeof body.taskStatus === 'string' ? JSON.parse(body.taskStatus) : body.taskStatus);
        await redis.del(`project:${projectId}:tasks`);
      } catch (e) { console.warn("Redis TaskStatus update error", e); }
    }

    if (tasksOutdated) {
      // Inject _tasksOutdated flag into formInputs without needing Prisma schema migration
      let formInputsObj = project.formInputs ? JSON.parse(project.formInputs) : {};
      formInputsObj._tasksOutdated = true;
      updateData.formInputs = JSON.stringify(formInputsObj);
    }

    if (Object.keys(updateData).length > 0) {
      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: updateData,
      });
      // Invalidate project info and structure cache in Redis
      try {
        await redis.del(`project:${projectId}:info`);
        if (appName !== undefined) {
          await redis.del(`project:${projectId}:struktur`);
        }
      } catch {}
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
