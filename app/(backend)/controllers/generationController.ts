import ExecutiveMember from "@/app/(backend)/models/executiveMember";
import ManagementBoard from "@/app/(backend)/models/managementBoard";

export async function getGenerations() {
  const [ebGens, mbGens] = await Promise.all([
    ExecutiveMember.distinct("generation"),
    ManagementBoard.distinct("generation"),
  ]);

  const allGens = Array.from(new Set([...ebGens, ...mbGens]))
    .map((g) => Number(g))
    .sort((a, b) => b - a);

  return allGens.length > 0 ? allGens : [6];
}
