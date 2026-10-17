import { NextResponse } from "next/server";
import { repo } from "@/lib/store";
import {
  errorResponse,
  logRouteError,
  readJsonBody,
  validationErrorResponse,
} from "@/lib/apiResponse";
import { validateProjectInput } from "@/components/Project/Project.utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id: projectId } = await params;

    const body = await readJsonBody(request);
    if (body === null) return errorResponse("Invalid JSON body", 400);

    const validation = validateProjectInput(body);
    if (!validation.ok) return validationErrorResponse(validation.errors);

    const updatedProject = await repo.update(projectId, validation.value);
    if (!updatedProject) return errorResponse("Project not found", 404);

    return NextResponse.json(updatedProject);
  } catch (error) {
    logRouteError("projects:update", error);
    return errorResponse("Could not update the project", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id: projectId } = await params;

    const wasDeleted = await repo.remove(projectId);
    if (!wasDeleted) return errorResponse("Project not found", 404);

    return NextResponse.json({ ok: true });
  } catch (error) {
    logRouteError("projects:delete", error);
    return errorResponse("Could not delete the project", 500);
  }
}