export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  tags: string[];
}

export const articles: Article[] = [
  {
    slug: "cybersecurity-essentials-every-developer-should-know",
    title: "Cybersecurity Essentials Every Developer Should Know",
    excerpt:
      "Protect your apps and users with these fundamental cybersecurity practices for developers.",
    content: `
      <p>In today's digital landscape, cybersecurity is not just the responsibility of security teams—it's a critical skill every developer must master. As cyber threats continue to evolve, developers play a crucial role in building secure applications from the ground up.</p>
      
      <h2>Understanding Common Vulnerabilities</h2>
      <p>The OWASP Top 10 provides a comprehensive list of the most critical security risks to web applications. Understanding these vulnerabilities is the first step in building secure software.</p>
      
      <h2>Secure Coding Practices</h2>
      <p>Implementing secure coding practices from the beginning of development is far more effective than trying to patch security holes later. This includes input validation, proper authentication, and secure data handling.</p>
      
      <h2>Regular Security Audits</h2>
      <p>Regular security audits and penetration testing help identify vulnerabilities before they can be exploited by malicious actors.</p>
    `,
    image: "/developer-working-on-cybersecurity-code.png",
    date: "April 13, 2025",
    author: "Admin",
    tags: ["Technology", "Design"],
  },
  {
    slug: "future-of-work-remote-first-teams-digital-tools",
    title: "The Future of Work: Remote-First Teams and Digital Tools",
    excerpt:
      "How tech companies are optimizing remote collaboration with smarter tools and processes.",
    content: `
      <p>The shift to remote work has fundamentally changed how teams collaborate and deliver results. Companies that embrace remote-first strategies are seeing increased productivity and employee satisfaction.</p>
      
      <h2>Digital Collaboration Tools</h2>
      <p>Modern teams rely on a suite of digital tools to maintain communication, track progress, and deliver high-quality work regardless of location.</p>
      
      <h2>Building Remote Culture</h2>
      <p>Creating a strong remote culture requires intentional effort to maintain team cohesion and company values across distributed teams.</p>
    `,
    image: "/remote-team-collaboration-digital-workspace.png",
    date: "April 10, 2025",
    author: "Admin",
    tags: ["Technology", "Design"],
  },
  {
    slug: "design-systems-why-your-team-needs-one-2025",
    title: "Design Systems: Why Your Team Needs One in 2025",
    excerpt:
      "Learn how design systems save time, ensure consistency, and scale design efforts.",
    content: `
      <p>Design systems have become essential for modern product development, providing a single source of truth for design decisions and enabling teams to build consistent user experiences at scale.</p>
      
      <h2>Benefits of Design Systems</h2>
      <p>A well-implemented design system reduces design debt, speeds up development, and ensures brand consistency across all touchpoints.</p>
      
      <h2>Implementation Strategy</h2>
      <p>Successfully implementing a design system requires buy-in from both design and development teams, along with clear governance and maintenance processes.</p>
    `,
    image: "/designer-working-on-design-system-components.png",
    date: "April 9, 2025",
    author: "Admin",
    tags: ["Technology", "Design"],
  },
  {
    slug: "web3-decentralized-internet-what-you-need-to-know",
    title: "Web3 and the Decentralized Internet: What You Need to Know",
    excerpt:
      "Understand the key ideas behind Web3 and how it could reshape the internet as we know it.",
    content: `
      <p>Web3 represents a paradigm shift towards a decentralized internet built on blockchain technology, promising greater user control and data ownership.</p>
      
      <h2>Core Principles of Web3</h2>
      <p>Decentralization, transparency, and user ownership are the foundational principles driving the Web3 movement.</p>
      
      <h2>Practical Applications</h2>
      <p>From decentralized finance (DeFi) to non-fungible tokens (NFTs), Web3 technologies are creating new possibilities for digital interaction and value exchange.</p>
    `,
    image: "/blockchain-web3-decentralized-network-visualizatio.png",
    date: "April 7, 2025",
    author: "Admin",
    tags: ["Technology", "Design"],
  },
  {
    slug: "debugging-like-pro-tools-techniques-faster-fixes",
    title: "Debugging Like a Pro: Tools & Techniques for Faster Fixes",
    excerpt:
      "A guide for developers to efficiently identify, trace, and fix code issues using modern tools.",
    content: `
      <p>Effective debugging is a crucial skill that separates good developers from great ones. Modern debugging tools and techniques can dramatically reduce the time spent hunting down bugs.</p>
      
      <h2>Modern Debugging Tools</h2>
      <p>Browser developer tools, IDE debuggers, and specialized debugging software provide powerful capabilities for identifying and fixing issues quickly.</p>
      
      <h2>Systematic Debugging Approach</h2>
      <p>A methodical approach to debugging, including reproduction steps, hypothesis testing, and documentation, leads to more efficient problem-solving.</p>
    `,
    image: "/developer-debugging-code-on-multiple-monitors.png",
    date: "April 5, 2025",
    author: "Admin",
    tags: ["Technology", "Design"],
  },
  {
    slug: "accessibility-in-design-more-than-just-compliance",
    title: "Accessibility in Design: More Than Just Compliance",
    excerpt:
      "Inclusive design makes better products—learn how to create experiences for everyone.",
    content: `
      <p>Accessibility in design goes beyond legal compliance—it's about creating inclusive experiences that work for everyone, regardless of their abilities or circumstances.</p>
      
      <h2>Universal Design Principles</h2>
      <p>Universal design principles help create products that are usable by people with the widest range of abilities and situations.</p>
      
      <h2>Testing for Accessibility</h2>
      <p>Regular accessibility testing, including automated tools and user testing with people with disabilities, ensures your products truly serve all users.</p>
    `,
    image: "/inclusive-design-accessibility-testing-interface.png",
    date: "April 2, 2025",
    author: "Admin",
    tags: ["Technology", "Design"],
  },
  {
    slug: "figmas-new-dev-mode-game-changer-designers-developers",
    title: "Figma's New Dev Mode: A Game-Changer for Designers & Developers",
    excerpt:
      "Explore how Figma's latest feature bridges the gap between design and development with real-time handoff tools.",
    content: `
      <p>In the ever-evolving world of digital product design, collaboration between designers and developers has always been a crucial—yet often challenging—part of the process. On April 25th, Figma introduced Dev Mode, a powerful new feature aimed at streamlining that collaboration more than ever before.</p>
      
      <h2>🤔 What is Dev Mode?</h2>
      <p>Dev Mode is a new interface within Figma that provides developer-focused tools and removes unnecessary UI clutter that designers typically use. Instead, developers get ready-to-implement specs, such as spacing, color values, font styles, and asset exports—without disrupting the design file or asking the design team for clarifications.</p>
      
      <h2>🤝 Bridging the Gap Between Design & Development</h2>
      <p>Traditionally, handing off designs involved back-and-forth communication, misunderstandings, and occasional delays. With Dev Mode, handoff becomes real-time and seamless:</p>
      <ul>
        <li><strong>Live Design Specs:</strong> Developers can inspect the design without needing additional tools or extensions.</li>
        <li><strong>Code Snippets:</strong> Automatically generated CSS, iOS (Swift), and Android (XML) code help speed up implementation.</li>
        <li><strong>Version History Access:</strong> Stay aligned with design updates without asking for a new export every time.</li>
        <li><strong>Integrated Comments:</strong> Developers can leave feedback directly in the design file.</li>
      </ul>
      
      <h2>🚀 Why It Matters</h2>
      <p>For design teams working in agile environments, the speed of handoff can make or break a sprint. Figma's Dev Mode turns a typically messy phase into a collaborative, real-time experience that reduces errors, shortens build times, and improves the designer-developer relationship.</p>
      
      <h2>🔮 Final Thoughts</h2>
      <p>Whether you're a solo designer working with freelance developers or part of a large product team, Figma's Dev Mode introduces a smoother, smarter way to collaborate. It's not just a feature—it's a shift in how digital products are built.</p>
      
      <p>💬 What do you think of Dev Mode? Have you tried it yet? Share your experience in the comments!</p>
    `,
    image: "/developer-working-with-figma-dev-mode-purple-light.png",
    date: "April 21, 2025",
    author: "Admin",
    tags: ["Technology", "Design"],
  },
  {
    slug: "how-ai-changing-game-front-end-development",
    title: "How AI is Changing the Game in Front-End Development",
    excerpt:
      "Discover how artificial intelligence is transforming UI coding and speeding up front-end workflows.",
    content: `
      <p>Artificial intelligence is revolutionizing front-end development, from automated code generation to intelligent design systems that adapt to user behavior.</p>
      
      <h2>AI-Powered Development Tools</h2>
      <p>Modern AI tools can generate code, suggest optimizations, and even create entire components based on natural language descriptions.</p>
      
      <h2>The Future of UI Development</h2>
      <p>As AI continues to evolve, we can expect even more sophisticated tools that will fundamentally change how we approach front-end development.</p>
    `,
    image: "/developer-using-ai-coding-tools-modern-workspace.png",
    date: "April 18, 2025",
    author: "Admin",
    tags: ["Technology", "Design"],
  },
  {
    slug: "10-ui-trends-dominating-2025",
    title: "10 UI Trends Dominating 2025",
    excerpt:
      "From neumorphism to minimal brutalism, see what's trending in the design world this year.",
    content: `
      <p>The design landscape continues to evolve rapidly, with new trends emerging that balance aesthetics with functionality and accessibility.</p>
      
      <h2>Emerging Visual Trends</h2>
      <p>This year's trends focus on creating more engaging and accessible user experiences while maintaining visual appeal.</p>
      
      <h2>Implementation Considerations</h2>
      <p>While trends can inspire, it's important to consider how they align with your brand and user needs before implementation.</p>
    `,
    image: "/modern-ui-design-trends-2025-interface-examples.png",
    date: "April 15, 2025",
    author: "Admin",
    tags: ["Technology", "Design"],
  },
];

export function getArticles() {
  return articles;
}

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getRelatedArticles(currentSlug: string, limit = 3) {
  return articles
    .filter((article) => article.slug !== currentSlug)
    .slice(0, limit);
}
