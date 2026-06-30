import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

/**
 * /.well-known/agent-skills/index.json — Agent Skills Discovery (RFC v0.2.0)
 */
export async function GET() {
  const skills = [
    { name: 'insurance-protection-score', type: 'tool', description: 'Calculate personalized insurance protection score (0-100)', url: 'https://paliwalsecure.in/api/tools/protection-score' },
    { name: 'compare-insurance-plans', type: 'tool', description: 'Compare plans from 51+ IRDAI insurers', url: 'https://paliwalsecure.in/api/tools/compare-plans' },
    { name: 'insuregpt-chat', type: 'tool', description: 'AI insurance advisor in Hindi/English/Hinglish', url: 'https://paliwalsecure.in/api/tools/insuregpt' },
    { name: 'claim-guidance', type: 'tool', description: 'Step-by-step claim filing + IRDAI escalation', url: 'https://paliwalsecure.in/api/tools/claim-guidance' },
    { name: 'policy-audit', type: 'tool', description: 'Audit existing policies for coverage gaps', url: 'https://paliwalsecure.in/api/tools/policy-audit' },
  ];

  const skillsWithHash = skills.map(s => ({
    ...s,
    sha256: createHash('sha256').update(s.url).digest('hex'),
  }));

  return NextResponse.json({
    $schema: 'https://agentskills.io/schemas/agent-skills-index.v0.2.0.json',
    skills: skillsWithHash,
  }, {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
  });
}
