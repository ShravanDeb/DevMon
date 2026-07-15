import type { BehaviouralAttributes, SignatureMove, SignatureMoveExplanation, EngineContext } from "@/types";
import { SIGNATURE_MOVE_CONFIG, SIGNATURE_MOVE_MIN_THRESHOLD, DEFAULT_SIGNATURE_MOVE } from "@/lib/config";

export function generateSignatureMove(
  attributes: BehaviouralAttributes,
  ctx: EngineContext
): { move: SignatureMove; explanation: SignatureMoveExplanation } {
  const topEntries = (Object.entries(attributes) as [keyof BehaviouralAttributes, number][])
    .sort((a, b) => b[1] - a[1]);

  const topAttr = topEntries[0];
  const secondAttr = topEntries[1];

  const match = SIGNATURE_MOVE_CONFIG.find(
    (m) => m.primaryAttribute === topAttr[0] && m.secondaryAttribute === secondAttr[0]
  );

  const thresholdMet = topAttr[1] >= SIGNATURE_MOVE_MIN_THRESHOLD && secondAttr[1] >= SIGNATURE_MOVE_MIN_THRESHOLD;

  const config = thresholdMet && match ? match : DEFAULT_SIGNATURE_MOVE;

  const move: SignatureMove = {
    name: config.name,
    description: config.description,
    icon: config.icon,
  };

  const explanation: SignatureMoveExplanation = {
    move,
    topAttribute: topAttr[0],
    secondAttribute: secondAttr[0],
    topScore: topAttr[1],
    secondScore: secondAttr[1],
    thresholdMet,
    reason: thresholdMet
      ? `Signature Move: ${config.name} (${topAttr[0]}=${topAttr[1]}, ${secondAttr[0]}=${secondAttr[1]})`
      : `Threshold not met (need ${SIGNATURE_MOVE_MIN_THRESHOLD}), using default: ${DEFAULT_SIGNATURE_MOVE.name}`,
  };

  ctx.signatureMoveExplanation = explanation;

  return { move, explanation };
}
