// ==============================================================================
// AcadIn Master Test Suite Execution Harness (Phase 3.3 Regression Suite)
// Description: Runs all unit, integration, security, and E2E recruitment test suites.
// ==============================================================================

import { runAssessmentScoringTests } from "./unit/assessment-scoring.test.ts";
import { runMatchingEngineTests } from "./unit/matching-engine.test.ts";
import { runApplicationLifecycleTests } from "./unit/application-lifecycle.test.ts";
import { runMentorshipAndAnalyticsTests } from "./unit/mentorship-and-analytics.test.ts";
import { runSecuritySuite } from "./security/rls-and-authorization.test.ts";
import { runAIGatewayResilienceTests } from "./integration/ai-gateway-resilience.test.ts";
import { runCrossRoleE2EWorkflowTests } from "./integration/cross-role-e2e-workflow.test.ts";

export async function runAllAcadInTests() {
  const startTime = Date.now();
  console.log("\n================================================================================");
  console.log("             AcadIn Comprehensive Platform Test Runner (Phase 3.3)               ");
  console.log("================================================================================\n");

  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;

  // 1. Assessment Unit Tests
  console.log("▶ [Suite 1/7] Assessment Scoring & Difficulty Calibration Unit Tests...");
  const suite1 = await runAssessmentScoringTests();
  suite1.tests.forEach((t) => console.log(`  ${t.passed ? "✔" : "✖"} ${t.name}`));
  totalTests += suite1.tests.length;
  totalPassed += suite1.passed;
  totalFailed += suite1.failed;

  // 2. Matching Engine Unit Tests
  console.log("\n▶ [Suite 2/7] Opportunity Matching & Academic Eligibility Unit Tests...");
  const suite2 = await runMatchingEngineTests();
  suite2.tests.forEach((t) => console.log(`  ${t.passed ? "✔" : "✖"} ${t.name}`));
  totalTests += suite2.tests.length;
  totalPassed += suite2.passed;
  totalFailed += suite2.failed;

  // 3. Application Lifecycle Unit Tests
  console.log("\n▶ [Suite 3/7] Application State Machine & Disallowed Transitions Unit Tests...");
  const suite3 = await runApplicationLifecycleTests();
  suite3.tests.forEach((t) => console.log(`  ${t.passed ? "✔" : "✖"} ${t.name}`));
  totalTests += suite3.tests.length;
  totalPassed += suite3.passed;
  totalFailed += suite3.failed;

  // 4. Mentorship & Analytics Unit Tests
  console.log("\n▶ [Suite 4/7] Mentorship Scheduling & Institutional Analytics Unit Tests...");
  const suite4 = await runMentorshipAndAnalyticsTests();
  suite4.tests.forEach((t) => console.log(`  ${t.passed ? "✔" : "✖"} ${t.name}`));
  totalTests += suite4.tests.length;
  totalPassed += suite4.passed;
  totalFailed += suite4.failed;

  // 5. Security & RLS Suite
  console.log("\n▶ [Suite 5/7] Multi-Tenant Isolation & Role Authorization Security Tests...");
  const suite5 = await runSecuritySuite();
  suite5.results.forEach((t) => console.log(`  ${t.passed ? "✔" : "✖"} [${t.id}] ${t.description}`));
  totalTests += suite5.total;
  totalPassed += suite5.passed;
  totalFailed += suite5.failed;

  // 6. AI Gateway Resilience
  console.log("\n▶ [Suite 6/7] Gemini AI Gateway & Structured Output Fallback Tests...");
  const suite6 = await runAIGatewayResilienceTests();
  suite6.tests.forEach((t) => console.log(`  ${t.passed ? "✔" : "✖"} ${t.name}`));
  totalTests += suite6.tests.length;
  totalPassed += suite6.passed;
  totalFailed += suite6.failed;

  // 7. Cross-Role E2E Workflow
  console.log("\n▶ [Suite 7/7] Cross-Role End-to-End Recruitment Workflow Tests...");
  const suite7 = await runCrossRoleE2EWorkflowTests();
  suite7.tests.forEach((t) => console.log(`  ${t.passed ? "✔" : "✖"} ${t.name}`));
  totalTests += suite7.tests.length;
  totalPassed += suite7.passed;
  totalFailed += suite7.failed;

  const durationMs = Date.now() - startTime;
  console.log("\n================================================================================");
  console.log(`Test Execution Summary: ${totalPassed}/${totalTests} Passed | ${totalFailed} Failed | Duration: ${durationMs}ms`);
  console.log("================================================================================\n");

  if (totalFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// Execute test suite
runAllAcadInTests().catch((err) => {
  console.error("Test execution failed with unhandled error:", err);
  process.exit(1);
});

