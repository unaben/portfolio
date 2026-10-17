import { NextResponse } from "next/server";
import { repo } from "@/lib/store";
import {
  errorResponse,
  logRouteError,
  readJsonBody,
  validationErrorResponse,
} from "@/lib/apiResponse";
import {
  sortProjects,
  validateProjectInput,
} from "@/components/Project/Project.utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await repo.list();
    return NextResponse.json(sortProjects(projects));
  } catch (error) {
    logRouteError("projects:list", error);
    return errorResponse("Could not load projects", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    if (body === null) return errorResponse("Invalid JSON body", 400);

    const validation = validateProjectInput(body);
    if (!validation.ok) return validationErrorResponse(validation.errors);

    const createdProject = await repo.create(validation.value);
    return NextResponse.json(createdProject, { status: 201 });
  } catch (error) {
    logRouteError("projects:create", error);
    return errorResponse("Could not create the project", 500);
  }
}