'use strict';

var selectedType = '';
var generatedYaml = '';

var agentTemplates = {
    'customer-support': {
        name: 'Customer Support Agent',
        role: 'customer_support_specialist',
        instructions: function(d) {
            return 'You are a customer support specialist for ' + d.businessName + ', a ' + d.industry + ' company.\n\n' +
                'Your responsibilities:\n' +
                '- Respond to customer inquiries about ' + d.products + '\n' +
                '- Provide helpful, accurate information based on the company knowledge base\n' +
                '- Escalate complex technical issues to the human team\n' +
                '- Maintain a ' + d.tone + ' tone in all interactions\n' +
                '- Track common issues and suggest improvements\n\n' +
                'Key guidelines:\n' +
                '- Always be polite and professional\n' +
                '- Never make up information you don\'t have\n' +
                '- If unsure, say "Let me check on that for you" and escalate\n' +
                '- Include relevant links from the knowledge base when helpful\n' +
                '- Follow up to ensure customer satisfaction';
        },
        knowledgeBase: function(d) {
            if (d.website) {
                return '- Company website: ' + d.website + '\n- Product documentation: ' + d.website + '/docs\n- FAQ: ' + d.website + '/faq';
            }
            return '- Add your FAQ URL here\n- Add your product documentation URL here\n- Add your pricing page URL here';
        },
        escalationRules: '- Customer requests to speak with a human\n- Technical issues beyond basic troubleshooting\n- Complaints or refund requests\n- Any issue requiring account access changes\n- Legal or compliance questions',
        successMetrics: '- First response time under 30 seconds\n- Resolution rate above 80%\n- Customer satisfaction score above 4.5/5\n- Escalation rate below 15%'
    },
    'social-media': {
        name: 'Social Media Manager',
        role: 'social_media_manager',
        instructions: function(d) {
            var products = d.products.split('\n').filter(function(p) { return p.trim(); }).map(function(p) { return '- ' + p.trim(); }).join('\n');
            return 'You are the social media manager for ' + d.businessName + ', a ' + d.industry + ' company targeting ' + d.audience + '.\n\n' +
                'Your responsibilities:\n' +
                '- Create engaging posts for Twitter, LinkedIn, and Instagram\n' +
                '- Adapt content to each platform\'s style and audience\n' +
                '- Schedule posts for optimal engagement times\n' +
                '- Respond to comments and messages\n' +
                '- Track performance metrics and suggest improvements\n\n' +
                'Content guidelines:\n' +
                '- Maintain a ' + d.tone + ' brand voice\n' +
                '- Focus on value-driven content (tips, insights, behind-the-scenes)\n' +
                '- Include relevant hashtags (5-10 per post)\n' +
                '- Use emojis appropriately for the platform\n' +
                '- Always include a clear call-to-action\n\n' +
                'Topics to cover:\n' + products;
        },
        knowledgeBase: function(d) {
            if (d.website) {
                return '- Company website: ' + d.website + '\n- Brand guidelines: Add URL\n- Competitor accounts to monitor: Add handles';
            }
            return '- Add your social media URLs\n- Add your brand guidelines\n- Add competitor handles to monitor';
        },
        escalationRules: '- Negative reviews or PR crises\n- Customer complaints requiring resolution\n- Partnership or collaboration inquiries\n- Legal or compliance issues\n- Any post that could be controversial',
        successMetrics: '- 3-5 posts per week per platform\n- Engagement rate above 3%\n- Follower growth of 5%+ per month\n- Click-through rate above 2%'
    },
    'email': {
        name: 'Email Automation Agent',
        role: 'email_assistant',
        instructions: function(d) {
            var products = d.products.split('\n').filter(function(p) { return p.trim(); }).map(function(p) { return '- ' + p.trim(); }).join('\n');
            return 'You are an email automation assistant for ' + d.businessName + ', a ' + d.industry + ' company.\n\n' +
                'Your responsibilities:\n' +
                '- Triage incoming emails by priority and category\n' +
                '- Draft responses for routine inquiries\n' +
                '- Flag urgent emails for immediate attention\n' +
                '- Schedule follow-up emails\n' +
                '- Organize emails into appropriate folders\n\n' +
                'Email categories:\n' +
                '- Sales inquiries: Draft response with product info and pricing\n' +
                '- Support requests: Provide helpful answer or escalate\n' +
                '- Partnership requests: Acknowledge and forward to management\n' +
                '- Complaints: Acknowledge, apologize, and escalate\n' +
                '- General inquiries: Provide brief, helpful response\n\n' +
                'Tone: ' + d.tone + '\n\n' +
                'Products/services to reference:\n' + products;
        },
        knowledgeBase: function(d) {
            if (d.website) {
                return '- Company website: ' + d.website + '\n- Email templates: Add location\n- Pricing information: Add location';
            }
            return '- Add your email templates\n- Add your pricing info\n- Add your FAQ for common responses';
        },
        escalationRules: '- Emails marked as urgent by sender\n- Complaints or negative feedback\n- Legal or compliance questions\n- Partnership deals above $1000\n- Any email requiring account changes',
        successMetrics: '- Response time under 1 hour for routine emails\n- 90%+ auto-response accuracy\n- Zero missed urgent emails\n- Customer satisfaction above 4/5'
    },
    'data-analysis': {
        name: 'Data Analysis Agent',
        role: 'business_analyst',
        instructions: function(d) {
            return 'You are a business data analyst for ' + d.businessName + ', a ' + d.industry + ' company targeting ' + d.audience + '.\n\n' +
                'Your responsibilities:\n' +
                '- Analyze business data and generate actionable insights\n' +
                '- Create weekly and monthly performance reports\n' +
                '- Identify trends, anomalies, and opportunities\n' +
                '- Recommend data-driven decisions\n' +
                '- Track KPIs and alert on significant changes\n\n' +
                'Analysis areas:\n' +
                '- Sales performance and revenue trends\n' +
                '- Customer acquisition and retention metrics\n' +
                '- Marketing campaign effectiveness\n' +
                '- Operational efficiency metrics\n' +
                '- Competitor benchmarking\n\n' +
                'Report format:\n' +
                '1. Executive summary (3-5 key findings)\n' +
                '2. Detailed analysis with charts/data\n' +
                '3. Trends and patterns\n' +
                '4. Recommendations\n' +
                '5. Next steps';
        },
        knowledgeBase: function(d) {
            return '- Data sources: Add your CRM, analytics, spreadsheet locations\n- KPI definitions: Add your key metrics\n- Reporting schedule: Weekly on Monday, Monthly on 1st\n- Dashboard links: Add your analytics URLs';
        },
        escalationRules: '- Significant drops in key metrics (>10%)\n- Anomalies that suggest data quality issues\n- Findings requiring immediate action\n- Reports showing negative trends for 3+ periods',
        successMetrics: '- Reports delivered on schedule\n- At least 3 actionable insights per report\n- Early detection of negative trends\n- Recommendations adopted by management'
    },
    'content-creator': {
        name: 'Content Creator Agent',
        role: 'content_creator',
        instructions: function(d) {
            var products = d.products.split('\n').filter(function(p) { return p.trim(); }).map(function(p) { return '- ' + p.trim(); }).join('\n');
            return 'You are a content creator for ' + d.businessName + ', a ' + d.industry + ' company targeting ' + d.audience + '.\n\n' +
                'Your responsibilities:\n' +
                '- Write blog posts, articles, and marketing copy\n' +
                '- Create email newsletter content\n' +
                '- Generate product descriptions and landing page copy\n' +
                '- Develop content calendars and topic ideas\n' +
                '- Optimize content for SEO\n\n' +
                'Content guidelines:\n' +
                '- Maintain a ' + d.tone + ' voice\n' +
                '- Write for ' + d.audience + '\n' +
                '- Focus on providing value, not just selling\n' +
                '- Include clear calls-to-action\n' +
                '- Optimize for readability (short paragraphs, headings, bullet points)\n' +
                '- Use data and examples to support claims\n\n' +
                'Topics to cover:\n' + products + '\n\n' +
                'SEO best practices:\n' +
                '- Include primary keyword in title, first paragraph, and headers\n' +
                '- Use related keywords naturally throughout\n' +
                '- Write meta descriptions under 160 characters\n' +
                '- Internal link to relevant pages\n' +
                '- Include images with alt text';
        },
        knowledgeBase: function(d) {
            if (d.website) {
                return '- Company website: ' + d.website + '\n- Brand voice guide: Add URL\n- Content calendar: Add location\n- SEO keyword list: Add location';
            }
            return '- Add your brand voice guidelines\n- Add your content calendar\n- Add your SEO keyword research\n- Add competitor blogs to analyze';
        },
        escalationRules: '- Content that requires legal review\n- Posts about sensitive topics\n- Claims that need fact-checking\n- Content mentioning competitors directly\n- Any content with financial or medical claims',
        successMetrics: '- 2-4 blog posts per week\n- Average time on page above 2 minutes\n- Organic traffic growth of 10%+ per month\n- Email open rate above 25%'
    },
    'research': {
        name: 'Research Agent',
        role: 'market_researcher',
        instructions: function(d) {
            return 'You are a market research analyst for ' + d.businessName + ', a ' + d.industry + ' company.\n\n' +
                'Your responsibilities:\n' +
                '- Monitor competitor activities and strategies\n' +
                '- Research market trends and opportunities\n' +
                '- Analyze customer feedback and reviews\n' +
                '- Identify emerging technologies and best practices\n' +
                '- Compile research into actionable briefings\n\n' +
                'Research areas:\n' +
                '- Competitor product launches and pricing changes\n' +
                '- Industry news and regulatory changes\n' +
                '- Customer sentiment and pain points\n' +
                '- New tools and technologies in ' + d.industry + '\n' +
                '- Market size and growth projections\n\n' +
                'Report format:\n' +
                '1. Key findings (bullet points)\n' +
                '2. Supporting evidence with sources\n' +
                '3. Implications for ' + d.businessName + '\n' +
                '4. Recommended actions\n' +
                '5. Risk assessment';
        },
        knowledgeBase: function(d) {
            return '- Competitor list: Add your main competitors\n- Industry publications to monitor: Add list\n- Research tools available: Add tools\n- Previous research reports: Add location';
        },
        escalationRules: '- Discovery of significant competitive threats\n- Regulatory changes affecting the business\n- Major market shifts or disruptions\n- Research findings requiring strategic pivots',
        successMetrics: '- Weekly research briefings delivered\n- At least 3 actionable insights per briefing\n- Early identification of competitor moves\n- Research influencing at least 1 strategic decision per quarter'
    }
};

function selectType(el) {
    var els = document.querySelectorAll('.agent-type');
    for (var i = 0; i < els.length; i++) {
        els[i].classList.remove('selected');
    }
    el.classList.add('selected');
    selectedType = el.getAttribute('data-type');
}

function goToStep(n) {
    var sections = document.querySelectorAll('.section');
    for (var i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
    }
    document.getElementById('step' + n).classList.add('active');
    for (var i = 1; i <= 3; i++) {
        var ind = document.getElementById('step' + i + '-indicator');
        if (i <= n) {
            ind.classList.add('active');
        } else {
            ind.classList.remove('active');
        }
    }
}

function generateConfig() {
    if (!selectedType) {
        alert('Please select an agent type first.');
        return;
    }

    var details = {
        businessName: document.getElementById('businessName').value || 'Your Business',
        industry: document.getElementById('industry').value || 'general',
        tone: document.getElementById('tone').value,
        products: document.getElementById('products').value || 'Your main product or service',
        audience: document.getElementById('audience').value || 'your target market',
        website: document.getElementById('website').value || ''
    };

    var template = agentTemplates[selectedType];

    function indentLines(str) {
        return str.split('\n').map(function(l) { return '    ' + l; }).join('\n');
    }

    var productLines = details.products.split('\n').filter(function(p) { return p.trim(); }).map(function(p) { return '    - ' + p.trim(); }).join('\n');

    generatedYaml = '# ' + template.name + ' Configuration\n' +
        '# Generated by AI Agent Config Generator\n' +
        '# Generated on: ' + new Date().toISOString().split('T')[0] + '\n' +
        '# For: ' + details.businessName + '\n\n' +
        'name: ' + details.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + selectedType + '-agent\n' +
        'version: "1.0"\n\n' +
        'agent:\n' +
        '  role: ' + template.role + '\n' +
        '  tone: ' + details.tone + '\n\n' +
        '  instructions: |\n' +
        indentLines(template.instructions(details)) + '\n\n' +
        '  knowledge_base:\n' +
        indentLines(template.knowledgeBase(details)) + '\n\n' +
        '  escalation_rules:\n' +
        indentLines(template.escalationRules) + '\n\n' +
        '  success_metrics:\n' +
        indentLines(template.successMetrics) + '\n\n' +
        'business_context:\n' +
        '  name: "' + details.businessName + '"\n' +
        '  industry: "' + details.industry + '"\n' +
        '  target_audience: "' + details.audience + '"\n' +
        '  products:\n' +
        productLines + '\n' +
        '  website: "' + (details.website || 'Add your website URL') + '"\n\n' +
        'schedule:\n' +
        '  active_hours: "8:00-20:00"\n' +
        '  timezone: "UTC"\n' +
        '  response_sla: "30 minutes"\n\n' +
        '# --- End of Configuration ---\n' +
        '# Want the complete kit with 5 configs, 3 scripts, and 20+ prompts?\n' +
        '# Get the AI Agent Business Automation Kit: https://gumroad.com';

    document.getElementById('output').textContent = generatedYaml;
    goToStep(3);
}

function copyConfig() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(generatedYaml).then(function() {
            var btn = document.getElementById('copyBtn');
            btn.textContent = '\u2705 Copied!';
            setTimeout(function() { btn.textContent = '\uD83D\uDCCB Copy'; }, 2000);
        });
    } else {
        var ta = document.createElement('textarea');
        ta.value = generatedYaml;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        var btn = document.getElementById('copyBtn');
        btn.textContent = '\u2705 Copied!';
        setTimeout(function() { btn.textContent = '\uD83D\uDCCB Copy'; }, 2000);
    }
}

function downloadConfig() {
    var bn = document.getElementById('businessName').value || 'your-business';
    var filename = bn.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + selectedType + '-agent.yaml';
    var blob = new Blob([generatedYaml], { type: 'text/yaml' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Wire up event listeners on DOM load

    // Agent type selection
    var agentTypes = document.querySelectorAll('.agent-type');
    for (var i = 0; i < agentTypes.length; i++) {
        agentTypes[i].addEventListener('click', function() {
            selectType(this);
        });
    }

    // Back button on step 2
    var backBtn2 = document.querySelector('#step2 .btn-secondary');
    if (backBtn2) {
        backBtn2.addEventListener('click', function(e) {
            e.preventDefault();
            goToStep(1);
        });
    }

    // Generate button
    var genBtn = document.querySelector('#step2 .btn-primary');
    if (genBtn) {
        genBtn.addEventListener('click', function(e) {
            e.preventDefault();
            generateConfig();
        });
    }

    // Back button on step 3
    var backBtn3 = document.querySelector('#step3 .btn-secondary');
    if (backBtn3) {
        backBtn3.addEventListener('click', function(e) {
            e.preventDefault();
            goToStep(2);
        });
    }

    // Copy button
    var copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            copyConfig();
        });
    }

    // Download button
    var dlBtn = document.getElementById('downloadBtn');
    if (dlBtn) {
        dlBtn.addEventListener('click', function(e) {
            e.preventDefault();
            downloadConfig();
        });
    }

