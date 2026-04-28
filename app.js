        let selectedType = '';
        let generatedYaml = '';

        const agentTemplates = {
            'customer-support': {
                name: 'Customer Support Agent',
                role: 'customer_support_specialist',
                instructions: (d) => `You are a customer support specialist for ${d.businessName}, a ${d.industry} company.

Your responsibilities:
- Respond to customer inquiries about ${d.products}
- Provide helpful, accurate information based on the company knowledge base
- Escalate complex technical issues to the human team
- Maintain a ${d.tone} tone in all interactions
- Track common issues and suggest improvements

Key guidelines:
- Always be polite and professional
- Never make up information you don't have
- If unsure, say "Let me check on that for you" and escalate
- Include relevant links from the knowledge base when helpful
- Follow up to ensure customer satisfaction`,
                knowledgeBase: (d) => d.website ? `- Company website: ${d.website}\n- Product documentation: ${d.website}/docs\n- FAQ: ${d.website}/faq` : `- Add your FAQ URL here\n- Add your product documentation URL here\n- Add your pricing page URL here`,
                escalationRules: `- Customer requests to speak with a human\n- Technical issues beyond basic troubleshooting\n- Complaints or refund requests\n- Any issue requiring account access changes\n- Legal or compliance questions`,
                successMetrics: `- First response time under 30 seconds\n- Resolution rate above 80%\n- Customer satisfaction score above 4.5/5\n- Escalation rate below 15%`
            },
            'social-media': {
                name: 'Social Media Manager',
                role: 'social_media_manager',
                instructions: (d) => `You are the social media manager for ${d.businessName}, a ${d.industry} company targeting ${d.audience}.

Your responsibilities:
- Create engaging posts for Twitter, LinkedIn, and Instagram
- Adapt content to each platform's style and audience
- Schedule posts for optimal engagement times
- Respond to comments and messages
- Track performance metrics and suggest improvements

Content guidelines:
- Maintain a ${d.tone} brand voice
- Focus on value-driven content (tips, insights, behind-the-scenes)
- Include relevant hashtags (5-10 per post)
- Use emojis appropriately for the platform
- Always include a clear call-to-action

Topics to cover:
${d.products.split('\n').filter(p => p.trim()).map(p => `- ${p.trim()}`).join('\n')}`,
                knowledgeBase: (d) => d.website ? `- Company website: ${d.website}\n- Brand guidelines: Add URL\n- Competitor accounts to monitor: Add handles` : `- Add your social media URLs\n- Add your brand guidelines\n- Add competitor handles to monitor`,
                escalationRules: `- Negative reviews or PR crises\n- Customer complaints requiring resolution\n- Partnership or collaboration inquiries\n- Legal or compliance issues\n- Any post that could be controversial`,
                successMetrics: `- 3-5 posts per week per platform\n- Engagement rate above 3%\n- Follower growth of 5%+ per month\n- Click-through rate above 2%`
            },
            'email': {
                name: 'Email Automation Agent',
                role: 'email_assistant',
                instructions: (d) => `You are an email automation assistant for ${d.businessName}, a ${d.industry} company.

Your responsibilities:
- Triage incoming emails by priority and category
- Draft responses for routine inquiries
- Flag urgent emails for immediate attention
- Schedule follow-up emails
- Organize emails into appropriate folders

Email categories:
- Sales inquiries: Draft response with product info and pricing
- Support requests: Provide helpful answer or escalate
- Partnership requests: Acknowledge and forward to management
- Complaints: Acknowledge, apologize, and escalate
- General inquiries: Provide brief, helpful response

Tone: ${d.tone}

Products/services to reference:
${d.products.split('\n').filter(p => p.trim()).map(p => `- ${p.trim()}`).join('\n')}`,
                knowledgeBase: (d) => d.website ? `- Company website: ${d.website}\n- Email templates: Add location\n- Pricing information: Add location` : `- Add your email templates\n- Add your pricing info\n- Add your FAQ for common responses`,
                escalationRules: `- Emails marked as urgent by sender\n- Complaints or negative feedback\n- Legal or compliance questions\n- Partnership deals above $1000\n- Any email requiring account changes`,
                successMetrics: `- Response time under 1 hour for routine emails\n- 90%+ auto-response accuracy\n- Zero missed urgent emails\n- Customer satisfaction above 4/5`
            },
            'data-analysis': {
                name: 'Data Analysis Agent',
                role: 'business_analyst',
                instructions: (d) => `You are a business data analyst for ${d.businessName}, a ${d.industry} company targeting ${d.audience}.

Your responsibilities:
- Analyze business data and generate actionable insights
- Create weekly and monthly performance reports
- Identify trends, anomalies, and opportunities
- Recommend data-driven decisions
- Track KPIs and alert on significant changes

Analysis areas:
- Sales performance and revenue trends
- Customer acquisition and retention metrics
- Marketing campaign effectiveness
- Operational efficiency metrics
- Competitor benchmarking

Report format:
1. Executive summary (3-5 key findings)
2. Detailed analysis with charts/data
3. Trends and patterns
4. Recommendations
5. Next steps`,
                knowledgeBase: (d) => `- Data sources: Add your CRM, analytics, spreadsheet locations\n- KPI definitions: Add your key metrics\n- Reporting schedule: Weekly on Monday, Monthly on 1st\n- Dashboard links: Add your analytics URLs`,
                escalationRules: `- Significant drops in key metrics (>10%)\n- Anomalies that suggest data quality issues\n- Findings requiring immediate action\n- Reports showing negative trends for 3+ periods`,
                successMetrics: `- Reports delivered on schedule\n- At least 3 actionable insights per report\n- Early detection of negative trends\n- Recommendations adopted by management`
            },
            'content-creator': {
                name: 'Content Creator Agent',
                role: 'content_creator',
                instructions: (d) => `You are a content creator for ${d.businessName}, a ${d.industry} company targeting ${d.audience}.

Your responsibilities:
- Write blog posts, articles, and marketing copy
- Create email newsletter content
- Generate product descriptions and landing page copy
- Develop content calendars and topic ideas
- Optimize content for SEO

Content guidelines:
- Maintain a ${d.tone} voice
- Write for ${d.audience}
- Focus on providing value, not just selling
- Include clear calls-to-action
- Optimize for readability (short paragraphs, headings, bullet points)
- Use data and examples to support claims

Topics to cover:
${d.products.split('\n').filter(p => p.trim()).map(p => `- ${p.trim()}`).join('\n')}

SEO best practices:
- Include primary keyword in title, first paragraph, and headers
- Use related keywords naturally throughout
- Write meta descriptions under 160 characters
- Internal link to relevant pages
- Include images with alt text`,
                knowledgeBase: (d) => d.website ? `- Company website: ${d.website}\n- Brand voice guide: Add URL\n- Content calendar: Add location\n- SEO keyword list: Add location` : `- Add your brand voice guidelines\n- Add your content calendar\n- Add your SEO keyword research\n- Add competitor blogs to analyze`,
                escalationRules: `- Content that requires legal review\n- Posts about sensitive topics\n- Claims that need fact-checking\n- Content mentioning competitors directly\n- Any content with financial or medical claims`,
                successMetrics: `- 2-4 blog posts per week\n- Average time on page above 2 minutes\n- Organic traffic growth of 10%+ per month\n- Email open rate above 25%`
            },
            'research': {
                name: 'Research Agent',
                role: 'market_researcher',
                instructions: (d) => `You are a market research analyst for ${d.businessName}, a ${d.industry} company.

Your responsibilities:
- Monitor competitor activities and strategies
- Research market trends and opportunities
- Analyze customer feedback and reviews
- Identify emerging technologies and best practices
- Compile research into actionable briefings

Research areas:
- Competitor product launches and pricing changes
- Industry news and regulatory changes
- Customer sentiment and pain points
- New tools and technologies in ${d.industry}
- Market size and growth projections

Report format:
1. Key findings (bullet points)
2. Supporting evidence with sources
3. Implications for ${d.businessName}
4. Recommended actions
5. Risk assessment`,
                knowledgeBase: (d) => `- Competitor list: Add your main competitors\n- Industry publications to monitor: Add list\n- Research tools available: Add tools\n- Previous research reports: Add location`,
                escalationRules: `- Discovery of significant competitive threats\n- Regulatory changes affecting the business\n- Major market shifts or disruptions\n- Research findings requiring strategic pivots`,
                successMetrics: `- Weekly research briefings delivered\n- At least 3 actionable insights per briefing\n- Early identification of competitor moves\n- Research influencing at least 1 strategic decision per quarter`
            }
        };

        function selectType(el) {
            document.querySelectorAll('.agent-type').forEach(t => t.classList.remove('selected'));
            el.classList.add('selected');
            selectedType = el.dataset.type;
        }

        function goToStep(n) {
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById('step' + n).classList.add('active');
            for (let i = 1; i <= 3; i++) {
                const ind = document.getElementById('step' + i + '-indicator');
                ind.classList.toggle('active', i <= n);
            }
        }

        function generateConfig() {
            if (!selectedType) { alert('Please select an agent type first.'); return; }
            
            const details = {
                businessName: document.getElementById('businessName').value || 'Your Business',
                industry: document.getElementById('industry').value || 'general',
                tone: document.getElementById('tone').value,
                products: document.getElementById('products').value || 'Your main product or service',
                audience: document.getElementById('audience').value || 'your target market',
                website: document.getElementById('website').value || ''
            };

            const template = agentTemplates[selectedType];

            generatedYaml = `# ${template.name} Configuration
# Generated by AI Agent Config Generator
# Generated on: ${new Date().toISOString().split('T')[0]}
# For: ${details.businessName}

name: ${details.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${selectedType}-agent
version: "1.0"

agent:
  role: ${template.role}
  tone: ${details.tone}
  
  instructions: |
${template.instructions(details).split('\n').map(l => '    ' + l).join('\n')}

  knowledge_base:
${template.knowledgeBase(details).split('\n').map(l => '    ' + l).join('\n')}

  escalation_rules:
${template.escalationRules.split('\n').map(l => '    ' + l).join('\n')}

  success_metrics:
${template.successMetrics.split('\n').map(l => '    ' + l).join('\n')}

business_context:
  name: "${details.businessName}"
  industry: "${details.industry}"
  target_audience: "${details.audience}"
  products:
${details.products.split('\n').filter(p => p.trim()).map(p => '    - ' + p.trim()).join('\n')}
  website: "${details.website || 'Add your website URL'}"

schedule:
  active_hours: "8:00-20:00"
  timezone: "UTC"
  response_sla: "30 minutes"

# --- End of Configuration ---
# Want the complete kit with 5 configs, 3 scripts, and 20+ prompts?
# Get the AI Agent Business Automation Kit: https://gumroad.com`;

            document.getElementById('output').textContent = generatedYaml;
            goToStep(3);
        }

        function copyConfig() {
            navigator.clipboard.writeText(generatedYaml).then(() => {
                const btn = event.target;
                btn.textContent = '\u2705 Copied!';
                setTimeout(() => btn.textContent = '\u{1F4CB} Copy', 2000);
            });
        }

        function downloadConfig() {
            const details = {
                businessName: document.getElementById('businessName').value || 'your-business',
            };
            const filename = `${details.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${selectedType}-agent.yaml`;
            const blob = new Blob([generatedYaml], { type: 'text/yaml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }
