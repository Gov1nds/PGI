/**
 * ProjectWorkspace — M-1: Redirect to ProjectDetail.
 * This component was a redundant shell that rendered ProjectDetail inside itself,
 * causing double API calls and duplicate headers. Now it simply redirects.
 */
import { Navigate, useParams } from "react-router-dom";

export default function ProjectWorkspace() {
  const { id } = useParams();
  return <Navigate to={`/project/${id}`} replace />;
}
