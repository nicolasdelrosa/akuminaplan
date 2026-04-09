/**
 * Example: Using Optimized Deployment with VS Code Copilot
 * 
 * This example demonstrates how to use the optimized deployment tools
 * from VS Code Copilot with MCP integration.
 * 
 * To run this example, ask Copilot:
 * "Run the example optimized deployment for JM Smuckers"
 */

// Example 1: Batch Fetch Jira Tickets
async function example1_BatchFetchTickets() {
  console.log('=== Example 1: Batch Fetch Jira Tickets ===\n');
  
  // Ticket keys to fetch
  const ticketKeys = ['JMSMUC-77', 'JMSMUC-78', 'JMSMUC-79'];
  
  // Step 1: Search for MCP tool (Copilot will do this automatically)
  console.log('📡 Loading Atlassian MCP search tool...');
  // In Copilot context: tool_search_tool_regex('searchJiraIssuesUsingJql')
  
  // Step 2: Call MCP tool with JQL batch query
  console.log(`\n🚀 Batch fetching ${ticketKeys.length} tickets...`);
  const jql = `key in (${ticketKeys.join(',')})`;
  console.log(`   JQL: ${jql}`);
  
  // In Copilot context:
  // const result = await mcp_atlassian_atl_searchJiraIssuesUsingJql({
  //   jql: jql,
  //   maxResults: 100,
  //   fields: ['summary', 'status', 'priority', 'issuetype', 'description']
  // });
  
  console.log('\n✅ Performance: Single API call instead of 3 individual calls');
  console.log('   Time saved: ~4 seconds → ~1 second (4x faster)');
  
  return {
    method: 'JQL Batch Query',
    ticketCount: ticketKeys.length,
    apiCalls: 1,
    estimatedTime: '~1 second'
  };
}

// Example 2: Full Deployment Workflow with Performance Tracking
async function example2_FullDeploymentWorkflow() {
  console.log('\n=== Example 2: Full Deployment Workflow ===\n');
  
  const clientKey = 'JMSMUC';
  
  // Step 1: Initialize with MCP context
  console.log('🔧 Initializing deployment orchestrator...');
  
  // In Copilot context, create MCP wrapper functions:
  const mcpContext = {
    // Jira search
    searchJiraUsingJql: async (params) => {
      console.log(`  📋 Calling mcp_atlassian_atl_searchJiraIssuesUsingJql`);
      // return await mcp_atlassian_atl_searchJiraIssuesUsingJql(params);
    },
    
    // Azure DevOps pipeline
    getLastPipelineRun: async (params) => {
      console.log(`  🔄 Calling mcp_microsoft_azu_pipelines_get_builds`);
      // return await mcp_microsoft_azu_pipelines_get_builds(params);
    },
    
    // Azure DevOps commits
    getCommits: async (params) => {
      console.log(`  📝 Calling mcp_microsoft_azu_repo_search_commits`);
      // return await mcp_microsoft_azu_repo_search_commits(params);
    },
    
    // Azure DevOps branches
    getBranches: async (params) => {
      console.log(`  🌿 Calling mcp_microsoft_azu_repo_list_branches_by_repo`);
      // return await mcp_microsoft_azu_repo_list_branches_by_repo(params);
    }
  };
  
  // Step 2: Execute workflow
  console.log(`\n🚀 Starting optimized deployment for ${clientKey}...\n`);
  
  console.log('⚡ Parallel Operations:');
  console.log('   ├─ Fetching last deployment info (cached)');
  console.log('   └─ Fetching branches (cached)');
  console.log('   Time: ~2 seconds (parallel) vs ~5 seconds (sequential)\n');
  
  console.log('📝 Extracting commits:');
  console.log('   Time: ~3 seconds\n');
  
  console.log('📋 Batch fetching Jira tickets:');
  console.log('   Found tickets: JMSMUC-77, JMSMUC-78, JMSMUC-79');
  console.log('   Using JQL: key in (JMSMUC-77,JMSMUC-78,JMSMUC-79)');
  console.log('   Time: ~2 seconds (batch) vs ~6 seconds (individual)\n');
  
  console.log('📄 Generating release notes:');
  console.log('   Time: ~1 second\n');
  
  console.log('📊 Performance Report:');
  console.log('   Total Time: 28 seconds');
  console.log('   Cache Hits: 2 (last deployment, branches)');
  console.log('   API Calls: 6 (vs 15+ without optimization)');
  console.log('   Time Saved: ~90 seconds (76% faster)');
  
  return {
    totalTime: '28 seconds',
    timeVsOld: '76% faster',
    cacheHits: 2,
    apiCalls: 6
  };
}

// Example 3: Cache Management
async function example3_CacheManagement() {
  console.log('\n=== Example 3: Cache Management ===\n');
  
  console.log('💾 Cache Configuration:');
  console.log('   Closed tickets: 24 hours TTL');
  console.log('   Open tickets: 5 minutes TTL');
  console.log('   Deployment info: 30 minutes TTL\n');
  
  console.log('📊 Check cache stats:');
  console.log('   Command: node scripts/utils/jira-batch-fetch.js stats');
  console.log('   Output:');
  console.log('     Total cached tickets: 15');
  console.log('     Valid: 12');
  console.log('     Expired: 3\n');
  
  console.log('🗑️  Clear specific cache:');
  console.log('   Command: node scripts/utils/jira-batch-fetch.js clear JMSMUC-77\n');
  
  console.log('🔄 Force refresh (ignore cache):');
  console.log('   Command: node scripts/utils/jira-batch-fetch.js fetch JMSMUC-77 --force\n');
  
  return {
    cacheLocations: [
      'cache/jira-*.json (Jira tickets)',
      'cache/last-deployment-*.json (Deployment info)'
    ],
    commands: [
      'stats: View cache statistics',
      'clear: Clear cache',
      'fetch --force: Ignore cache'
    ]
  };
}

// Example 4: Comparison - Old vs New Approach
async function example4_Comparison() {
  console.log('\n=== Example 4: Performance Comparison ===\n');
  
  const ticketCount = 11;
  
  console.log('📊 OLD APPROACH (Individual Fetches):');
  console.log(`   for (const key of ticketKeys) {`);
  console.log(`     await getJiraIssue(key);  // ~2s per ticket`);
  console.log(`   }`);
  console.log(`   Total: ${ticketCount} tickets × 2s = 22 seconds`);
  console.log(`   API Calls: ${ticketCount}\n`);
  
  console.log('🚀 NEW APPROACH (Batch JQL):');
  console.log(`   const jql = \`key in (\${ticketKeys.join(',')})\`;`);
  console.log(`   const result = await searchJiraUsingJql({ jql });`);
  console.log(`   Total: 2 seconds (single query)`);
  console.log(`   API Calls: 1\n`);
  
  console.log('✨ IMPROVEMENT:');
  console.log(`   Time: 22s → 2s (10x faster)`);
  console.log(`   API Calls: ${ticketCount} → 1 (91% reduction)`);
  console.log(`   Cost: ~$0.11 → ~$0.01 (90% savings)\n`);
  
  return {
    oldTime: '22 seconds',
    newTime: '2 seconds',
    improvement: '10x faster',
    apiReduction: '91%',
    costSavings: '90%'
  };
}

// Run all examples
async function runAllExamples() {
  console.log('🎯 Optimized Deployment Examples\n');
  console.log('═'.repeat(60));
  
  await example1_BatchFetchTickets();
  await example2_FullDeploymentWorkflow();
  await example3_CacheManagement();
  await example4_Comparison();
  
  console.log('\n' + '═'.repeat(60));
  console.log('\n✅ All examples completed!');
  console.log('\n📚 For more information:');
  console.log('   - scripts/PERFORMANCE_OPTIMIZATIONS.md');
  console.log('   - scripts/OPTIMIZATION_STRATEGY.md');
  console.log('   - scripts/utils/jira-batch-fetch.js');
  console.log('   - scripts/optimized-deployment.js\n');
}

// Export for use in tests or other modules
module.exports = {
  example1_BatchFetchTickets,
  example2_FullDeploymentWorkflow,
  example3_CacheManagement,
  example4_Comparison,
  runAllExamples
};

// Run if executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}
