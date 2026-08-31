import type { AssessmentQuestion } from "@/types/assessment";

export const QUESTION_BANK: AssessmentQuestion[] = [
  // ==========================================
  // REACT (web-react)
  // ==========================================
  {
    id: "q-react-beg-1",
    skillId: "web-react",
    skillName: "React",
    category: "Web & Frontend",
    topic: "JSX & Props",
    difficulty: "beginner",
    question: "In React, what is the primary purpose of passing `props` to a component?",
    options: [
      "To directly mutate the internal DOM tree of another component",
      "To pass arbitrary read-only data and callback handlers from a parent to a child component",
      "To trigger a synchronous full-page browser refresh",
      "To store global variables inside browser local storage",
    ],
    correctAnswer: 1,
    explanation:
      "Props (short for properties) are unidirectional, read-only inputs passed from parent components down to child components in React.",
    score: 10,
    relatedSkills: ["JavaScript", "TypeScript"],
  },
  {
    id: "q-react-beg-2",
    skillId: "web-react",
    skillName: "React",
    category: "Web & Frontend",
    topic: "useState Hook",
    difficulty: "beginner",
    question: "How should you update state when the new state value depends on the previous state?",
    options: [
      "Mutate `state.count = state.count + 1` directly",
      "Call `setCount((prevCount) => prevCount + 1)` with a functional updater",
      "Re-render the root DOM tree with `ReactDOM.render`",
      "Call `this.forceUpdate()` inside the functional component",
    ],
    correctAnswer: 1,
    explanation:
      "Using the functional updater form `setCount(prev => prev + 1)` ensures that React applies the update using the latest queued state value without race conditions.",
    score: 10,
    relatedSkills: ["JavaScript"],
  },
  {
    id: "q-react-int-1",
    skillId: "web-react",
    skillName: "React",
    category: "Web & Frontend",
    topic: "useEffect Cleanup",
    difficulty: "intermediate",
    question: "When does the cleanup function returned inside a `useEffect` callback execute?",
    options: [
      "Only when the entire browser window closes",
      "Before the component unmounts and before re-running the effect due to dependency changes",
      "Immediately after the JSX finishes compiling to HTML",
      "Whenever `setState` is called inside another child component",
    ],
    correctAnswer: 1,
    explanation:
      "The cleanup function runs before the component is removed from the UI (unmount) and prior to re-executing the effect when dependency values change.",
    score: 20,
    relatedSkills: ["JavaScript", "TypeScript"],
  },
  {
    id: "q-react-int-2",
    skillId: "web-react",
    skillName: "React",
    category: "Web & Frontend",
    topic: "useCallback & useMemo",
    difficulty: "intermediate",
    question: "What is the primary operational difference between `useMemo` and `useCallback`?",
    options: [
      "`useMemo` runs synchronously on the server while `useCallback` runs in Web Workers",
      "`useMemo` memoizes the calculated return value of a function; `useCallback` memoizes the function definition itself",
      "`useMemo` is for class components; `useCallback` is for functional components",
      "`useCallback` triggers automatic network caching; `useMemo` caches local storage",
    ],
    correctAnswer: 1,
    explanation:
      "`useMemo(() => computeValue(a, b), [a, b])` caches the computed output, while `useCallback(fn, deps)` caches the function instance between renders.",
    score: 20,
    relatedSkills: ["JavaScript", "TypeScript"],
  },
  {
    id: "q-react-adv-1",
    skillId: "web-react",
    skillName: "React",
    category: "Web & Frontend",
    topic: "React 18 Concurrent Rendering",
    difficulty: "advanced",
    question:
      "What is the primary benefit of wrapping non-urgent state updates in `startTransition` in React 18?",
    options: [
      "It transforms client-side React code into native WebAssembly binaries",
      "It marks the update as low-priority, allowing urgent user interactions (like typing) to interrupt the render and keep the UI responsive",
      "It bypasses all React reconciliation checks and writes directly to innerHTML",
      "It forces the component to execute strictly on the backend Node.js thread",
    ],
    correctAnswer: 1,
    explanation:
      "`startTransition` tells React that the state update is non-urgent and interruptible, preserving 60fps input responsiveness during heavy re-renders.",
    score: 30,
    relatedSkills: ["JavaScript", "TypeScript", "System Design"],
  },
  {
    id: "q-react-adv-2",
    skillId: "web-react",
    skillName: "React",
    category: "Web & Frontend",
    topic: "Custom Hooks & Ref Inversion",
    difficulty: "advanced",
    question:
      "Why is reading or writing to `ref.current` during the render phase considered an anti-pattern in React?",
    options: [
      "Because refs cause immediate memory leaks in browser garbage collectors",
      "Because Concurrent React may render a component multiple times or abort renders, leading to unpredictable, inconsistent state side-effects",
      "Because TypeScript forbids accessing the `current` property in JSX",
      "Because refs cannot hold object or DOM node references",
    ],
    correctAnswer: 1,
    explanation:
      "Render phase functions must remain pure. Mutating or relying on refs during render violates predictability because Concurrent React can discard or re-run renders.",
    score: 30,
    relatedSkills: ["TypeScript", "JavaScript"],
  },

  // ==========================================
  // TYPESCRIPT (lang-typescript)
  // ==========================================
  {
    id: "q-ts-beg-1",
    skillId: "lang-typescript",
    skillName: "TypeScript",
    category: "Programming Languages",
    topic: "Basic Typing",
    difficulty: "beginner",
    question: "What is the difference between `unknown` and `any` in TypeScript?",
    options: [
      "`unknown` is type-safe because operations on it require explicit type checking or assertion; `any` disables all type checking",
      "`any` only accepts numbers, while `unknown` accepts strings",
      "`unknown` is compiled to string at runtime; `any` is compiled to boolean",
      "There is no difference; they are exact aliases in TypeScript",
    ],
    correctAnswer: 0,
    explanation:
      "`unknown` is the type-safe counterpart of `any`. Anything is assignable to `unknown`, but `unknown` is not assignable to anything without narrowing.",
    score: 10,
    relatedSkills: ["JavaScript"],
  },
  {
    id: "q-ts-int-1",
    skillId: "lang-typescript",
    skillName: "TypeScript",
    category: "Programming Languages",
    topic: "Generics & Utility Types",
    difficulty: "intermediate",
    question: "What does the TypeScript built-in utility type `Record<K, T>` construct?",
    options: [
      "An immutable array where every element is of type `K`",
      "An object type whose property keys are `K` and whose property values are `T`",
      "A database table schema with foreign keys",
      "A tuple containing exactly two elements of types `K` and `T`",
    ],
    correctAnswer: 1,
    explanation:
      "`Record<K, T>` produces an object type whose property keys are of type `K` and whose property values are of type `T`.",
    score: 20,
    relatedSkills: ["JavaScript"],
  },
  {
    id: "q-ts-int-2",
    skillId: "lang-typescript",
    skillName: "TypeScript",
    category: "Programming Languages",
    topic: "Type Narrowing & Discriminated Unions",
    difficulty: "intermediate",
    question:
      "In TypeScript, what enables a 'Discriminated Union' pattern between multiple object types?",
    options: [
      "A shared literal property with a unique value across each member of the union",
      "Declaring all interfaces with `export default`",
      "Using the `eval()` keyword inside type guards",
      "Adding a private symbol field to the prototype chain",
    ],
    correctAnswer: 0,
    explanation:
      "A discriminated union relies on a common, single literal property (e.g. `type: 'circle' | 'square'`) that TypeScript uses to narrow the union in control flow.",
    score: 20,
    relatedSkills: ["JavaScript"],
  },
  {
    id: "q-ts-adv-1",
    skillId: "lang-typescript",
    skillName: "TypeScript",
    category: "Programming Languages",
    topic: "Conditional Types & infer",
    difficulty: "advanced",
    question:
      "In the conditional type `type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;`, what does the `infer` keyword do?",
    options: [
      "It converts the function into an asynchronous Promise",
      "It introduces a type variable `R` to be deduced from the function's return type during matching",
      "It executes the function at compile-time to compute its value",
      "It instructs the TypeScript compiler to ignore runtime exceptions",
    ],
    correctAnswer: 1,
    explanation:
      "`infer R` allows declaring a type variable within the `extends` clause of a conditional type that TypeScript deduces dynamically.",
    score: 30,
    relatedSkills: ["JavaScript"],
  },
  {
    id: "q-ts-adv-2",
    skillId: "lang-typescript",
    skillName: "TypeScript",
    category: "Programming Languages",
    topic: "Template Literal Types & Mapped Types",
    difficulty: "advanced",
    question: "How do Template Literal Types in TypeScript enhance string type safety?",
    options: [
      "They allow constructing complex string pattern unions (e.g. `on${Capitalize<Event>}`) enforced strictly at compile time",
      "They replace JavaScript template literals `${}` with compile-time macros",
      "They automatically sanitize strings against SQL injection",
      "They compress string literals in the emitted `.js` bundle",
    ],
    correctAnswer: 0,
    explanation:
      "Template Literal Types allow building and validating domain-specific string patterns (like event handlers, CSS units, or API endpoints) via compile-time type composition.",
    score: 30,
    relatedSkills: ["JavaScript"],
  },

  // ==========================================
  // PYTHON (lang-python)
  // ==========================================
  {
    id: "q-py-beg-1",
    skillId: "lang-python",
    skillName: "Python",
    category: "Programming Languages",
    topic: "Lists & Mutability",
    difficulty: "beginner",
    question: "What is the difference between a Python `list` and a Python `tuple`?",
    options: [
      "Lists are immutable while tuples are mutable",
      "Lists are mutable (modifiable in-place) while tuples are immutable",
      "Tuples can only store integers while lists can store any object",
      "Lists cannot be sliced with `[start:stop]` syntax",
    ],
    correctAnswer: 1,
    explanation:
      "In Python, lists are mutable ordered sequences (created with `[]`), whereas tuples are immutable (created with `()`).",
    score: 10,
    relatedSkills: ["Data Structures & Algorithms"],
  },
  {
    id: "q-py-int-1",
    skillId: "lang-python",
    skillName: "Python",
    category: "Programming Languages",
    topic: "Generators & yield",
    difficulty: "intermediate",
    question:
      "What is the key advantage of using a generator function with `yield` over returning a standard list in Python?",
    options: [
      "Generators execute on GPU hardware automatically",
      "Generators yield values lazily one at a time on demand, consuming $O(1)$ memory for arbitrary sequence lengths",
      "Generators disable the Global Interpreter Lock (GIL)",
      "Generators can only be iterated over backwards",
    ],
    correctAnswer: 1,
    explanation:
      "Generators maintain state between iterations and produce items on demand without allocating the entire collection in memory at once.",
    score: 20,
    relatedSkills: ["Data Structures & Algorithms"],
  },
  {
    id: "q-py-adv-1",
    skillId: "lang-python",
    skillName: "Python",
    category: "Programming Languages",
    topic: "GIL & Concurrency",
    difficulty: "advanced",
    question:
      "How does the Global Interpreter Lock (GIL) in CPython affect multi-threaded CPU-bound programs?",
    options: [
      "It allows all CPU cores to execute Python bytecode simultaneously without race conditions",
      "It restricts execution to one native thread executing Python bytecode at a time, making `multiprocessing` preferred for CPU-bound tasks",
      "It causes Python threads to crash when allocating heap objects",
      "It automatically converts CPU-bound tasks into asynchronous coroutines",
    ],
    correctAnswer: 1,
    explanation:
      "CPython's GIL ensures thread safety by allowing only one thread to execute Python bytecode at a time. For CPU-bound parallel speedups, `multiprocessing` is typically used.",
    score: 30,
    relatedSkills: ["System Design"],
  },

  // ==========================================
  // DATA STRUCTURES & ALGORITHMS (cs-dsa)
  // ==========================================
  {
    id: "q-dsa-beg-1",
    skillId: "cs-dsa",
    skillName: "Data Structures & Algorithms",
    category: "Computer Science Fundamentals",
    topic: "Complexity Analysis",
    difficulty: "beginner",
    question:
      "What is the average time complexity of searching for an element in a balanced Binary Search Tree (BST) containing $N$ nodes?",
    options: ["$O(1)$", "$O(\\log N)$", "$O(N)$", "$O(N^2)$"],
    correctAnswer: 1,
    explanation:
      "In a balanced BST (such as an AVL or Red-Black tree), each comparison halves the search space, resulting in $O(\\log N)$ time complexity.",
    score: 10,
    relatedSkills: ["Computer Science Fundamentals"],
  },
  {
    id: "q-dsa-int-1",
    skillId: "cs-dsa",
    skillName: "Data Structures & Algorithms",
    category: "Computer Science Fundamentals",
    topic: "Hash Map Collisions",
    difficulty: "intermediate",
    question:
      "What happens to the time complexity of lookup in a Hash Table if all inserted keys collide into the exact same bucket (using separate chaining with a linked list)?",
    options: [
      "It remains $O(1)$",
      "It degrades to $O(N)$ where $N$ is the number of keys",
      "It improves to $O(\\log N)$",
      "It throws a stack overflow error immediately",
    ],
    correctAnswer: 1,
    explanation:
      "When all keys collide into a single bucket using linked-list chaining, lookup requires traversing the entire list of $N$ elements, degrading from $O(1)$ average to $O(N)$ worst-case.",
    score: 20,
    relatedSkills: ["Computer Science Fundamentals"],
  },
  {
    id: "q-dsa-adv-1",
    skillId: "cs-dsa",
    skillName: "Data Structures & Algorithms",
    category: "Computer Science Fundamentals",
    topic: "Dynamic Programming & DAGs",
    difficulty: "advanced",
    question:
      "Which condition must a problem satisfy to be solvable efficiently using Dynamic Programming (DP)?",
    options: [
      "Optimal Substructure and Overlapping Subproblems",
      "Greedy Choice Property and Infinite Memory",
      "Unbounded Recursive Call Stacks and No Memoization",
      "Complete Binary Tree Representation",
    ],
    correctAnswer: 0,
    explanation:
      "Dynamic Programming is applicable when a problem exhibits Optimal Substructure (an optimal solution contains optimal solutions to subproblems) and Overlapping Subproblems (the same subproblems are solved repeatedly).",
    score: 30,
    relatedSkills: ["Computer Science Fundamentals"],
  },

  // ==========================================
  // SQL & DATABASES (lang-sql / db-postgresql)
  // ==========================================
  {
    id: "q-sql-beg-1",
    skillId: "lang-sql",
    skillName: "SQL",
    category: "Programming Languages",
    topic: "Basic Queries & Joins",
    difficulty: "beginner",
    question:
      "Which SQL `JOIN` clause returns all rows from the left table and matching rows from the right table (filling NULLs if no match exists)?",
    options: ["INNER JOIN", "LEFT OUTER JOIN", "CROSS JOIN", "FULL OUTER JOIN"],
    correctAnswer: 1,
    explanation:
      "`LEFT JOIN` (or `LEFT OUTER JOIN`) preserves all records from the left table regardless of whether a matching record exists in the right table.",
    score: 10,
    relatedSkills: ["Databases & Storage"],
  },
  {
    id: "q-sql-int-1",
    skillId: "lang-sql",
    skillName: "SQL",
    category: "Programming Languages",
    topic: "Indexes & B-Trees",
    difficulty: "intermediate",
    question:
      "Why does adding a B-Tree index on a high-cardinality column dramatically speed up `WHERE column = ?` queries on large tables?",
    options: [
      "It compresses the entire table into RAM as a JSON document",
      "It allows the query planner to navigate a balanced tree structure in $O(\\log N)$ block reads instead of performing a full sequential table scan ($O(N)$)",
      "It prevents duplicate rows from ever being written to the database",
      "It executes the query using client-side JavaScript in parallel",
    ],
    correctAnswer: 1,
    explanation:
      "B-Tree indexes maintain sorted key references across disk pages, enabling logarithmic tree traversals rather than reading every physical table page.",
    score: 20,
    relatedSkills: ["Databases & Storage", "System Design"],
  },
  {
    id: "q-sql-adv-1",
    skillId: "lang-sql",
    skillName: "SQL",
    category: "Programming Languages",
    topic: "ACID & Isolation Levels",
    difficulty: "advanced",
    question:
      "Under the SQL standard isolation level `REPEATABLE READ`, which concurrency phenomenon is prevented that could occur in `READ COMMITTED`?",
    options: [
      "Dirty Reads only",
      "Non-Repeatable Reads (fuzzy reads, where re-reading a row in the same transaction sees modified values from committed concurrent transactions)",
      "Deadlocks",
      "Table Dropping",
    ],
    correctAnswer: 1,
    explanation:
      "`REPEATABLE READ` guarantees that any data read within a transaction remains identical on subsequent reads throughout the transaction, preventing Non-Repeatable Reads.",
    score: 30,
    relatedSkills: ["Databases & Storage", "System Design"],
  },

  // ==========================================
  // JAVASCRIPT (lang-javascript)
  // ==========================================
  {
    id: "q-js-beg-1",
    skillId: "lang-javascript",
    skillName: "JavaScript",
    category: "Programming Languages",
    topic: "Equality & Types",
    difficulty: "beginner",
    question: "What is the difference between `==` and `===` in JavaScript?",
    options: [
      "`==` performs type coercion before comparison; `===` checks both value and type strictly without coercion",
      "`===` only works for numbers while `==` works for strings",
      "`==` creates a deep clone of the objects being compared",
      "`===` is deprecated in modern ECMAScript standards",
    ],
    correctAnswer: 0,
    explanation:
      "`==` allows implicit type conversion (e.g. `'5' == 5` is true), whereas `===` requires both operand types and values to match strictly.",
    score: 10,
    relatedSkills: ["Web & Frontend"],
  },
  {
    id: "q-js-int-1",
    skillId: "lang-javascript",
    skillName: "JavaScript",
    category: "Programming Languages",
    topic: "Event Loop & Microtasks",
    difficulty: "intermediate",
    question:
      "In the JavaScript runtime event loop, which queue has priority for execution after the current call stack clears: Microtasks (e.g. `Promise.then`) or Macrotasks (e.g. `setTimeout`)?",
    options: [
      "Macrotasks (`setTimeout`) always execute before Microtasks",
      "Microtasks queue is completely drained before the next Macrotask is processed",
      "Both queues execute alternately in round-robin order",
      "Execution order is randomized based on CPU clock speed",
    ],
    correctAnswer: 1,
    explanation:
      "After the current synchronous execution context finishes, the event loop completely drains all pending microtasks (Promises, `queueMicrotask`) before picking the next macrotask.",
    score: 20,
    relatedSkills: ["Web & Frontend", "Node.js"],
  },
  {
    id: "q-js-adv-1",
    skillId: "lang-javascript",
    skillName: "JavaScript",
    category: "Programming Languages",
    topic: "Closures & Memory Leaks",
    difficulty: "advanced",
    question:
      "How can closures unintentionally cause memory retention leaks in long-running JavaScript single-page applications?",
    options: [
      "By preventing the V8 compiler from generating machine code",
      "When inner functions maintain lexical scope references to large outer objects that are never unreferenced or cleared from global handlers / listeners",
      "Because JavaScript engines do not feature garbage collection",
      "By overriding the `Object.prototype` constructor",
    ],
    correctAnswer: 1,
    explanation:
      "A closure keeps variables in its lexical scope reachable in memory. If the closure is retained (e.g. attached to an active DOM listener or singleton), large referenced objects cannot be garbage collected.",
    score: 30,
    relatedSkills: ["Web & Frontend", "React"],
  },

  // ==========================================
  // DOCKER & CLOUD (cloud-docker / cloud-aws)
  // ==========================================
  {
    id: "q-docker-beg-1",
    skillId: "cloud-docker",
    skillName: "Docker",
    category: "Cloud Computing",
    topic: "Containers vs VMs",
    difficulty: "beginner",
    question:
      "What is the fundamental architectural difference between a Docker container and a traditional Virtual Machine (VM)?",
    options: [
      "Containers bundle a full guest operating system with virtualized hardware; VMs share the host kernel directly",
      "Containers share the host operating system kernel and isolate processes at the user-space level; VMs run independent guest OS instances on hypervisors",
      "Containers cannot run Linux applications",
      "VMs do not require RAM or CPU resources",
    ],
    correctAnswer: 1,
    explanation:
      "Containers share the host OS kernel via Linux namespaces and cgroups, making them lightweight and fast to start compared to full guest OS virtual machines.",
    score: 10,
    relatedSkills: ["Cloud Computing", "DevOps & Platform"],
  },
  {
    id: "q-docker-int-1",
    skillId: "cloud-docker",
    skillName: "Docker",
    category: "Cloud Computing",
    topic: "Layer Caching & Multi-Stage Builds",
    difficulty: "intermediate",
    question:
      "What is the primary objective of using Multi-Stage Docker builds in production deployments?",
    options: [
      "To run multiple containers on the same port simultaneously",
      "To separate the build environment (compilers, SDKs) from the final minimal runtime image, reducing image size and attack surface",
      "To automatically deploy containers to AWS without credentials",
      "To compile Dockerfiles into Kubernetes YAML files",
    ],
    correctAnswer: 1,
    explanation:
      "Multi-stage builds allow compiling in heavy intermediate builder stages and copying only the resulting production artifacts into a clean minimal base image (like Alpine).",
    score: 20,
    relatedSkills: ["Cloud Computing", "DevOps & Platform"],
  },

  // ==========================================
  // MACHINE LEARNING & AI (ai-ml-fundamentals)
  // ==========================================
  {
    id: "q-ml-beg-1",
    skillId: "ai-ml-fundamentals",
    skillName: "Machine Learning Fundamentals",
    category: "AI & Machine Learning",
    topic: "Supervised vs Unsupervised",
    difficulty: "beginner",
    question: "What characterizes a 'Supervised Learning' task in machine learning?",
    options: [
      "The model groups unlabelled data points based on cluster proximity",
      "The model is trained on input features paired with ground-truth target labels",
      "The model learns purely through environmental rewards and penalties without data",
      "The algorithm only runs on quantum computers",
    ],
    correctAnswer: 1,
    explanation:
      "Supervised learning trains models on labeled datasets consisting of input features $X$ and target outputs $Y$ (e.g. classification or regression).",
    score: 10,
    relatedSkills: ["Python", "Data & Analytics"],
  },
  {
    id: "q-ml-int-1",
    skillId: "ai-ml-fundamentals",
    skillName: "Machine Learning Fundamentals",
    category: "AI & Machine Learning",
    topic: "Overfitting & Regularization",
    difficulty: "intermediate",
    question: "What occurs when a machine learning model suffers from high 'overfitting'?",
    options: [
      "It performs poorly on training data but generalizes exceptionally well to new test data",
      "It achieves near-zero error on the training dataset but exhibits high error and poor generalization on unseen validation/test data",
      "It takes zero seconds to train regardless of dataset size",
      "It predicts the exact same constant value for every input",
    ],
    correctAnswer: 1,
    explanation:
      "Overfitting happens when a high-capacity model memorizes the training data noise instead of the underlying true distribution, failing to generalize to unseen test inputs.",
    score: 20,
    relatedSkills: ["Python", "Data & Analytics"],
  },
  {
    id: "q-ml-adv-1",
    skillId: "ai-ml-fundamentals",
    skillName: "Machine Learning Fundamentals",
    category: "AI & Machine Learning",
    topic: "Loss Functions & Optimization",
    difficulty: "advanced",
    question:
      "Why is Cross-Entropy Loss preferred over Mean Squared Error (MSE) for multi-class classification problems trained with Softmax?",
    options: [
      "Cross-Entropy loss provides stronger gradient signals when predictions are highly confident but wrong, preventing learning slowdowns caused by sigmoid/softmax saturation",
      "MSE cannot be computed for decimal numbers",
      "Cross-Entropy removes the need for backpropagation",
      "Softmax requires square roots which break MSE",
    ],
    correctAnswer: 0,
    explanation:
      "Cross-entropy loss combined with softmax creates a convex loss surface whose derivative is linear in prediction error $(p - y)$, avoiding vanishing gradient plateaus during optimization.",
    score: 30,
    relatedSkills: ["Python", "AI & Machine Learning"],
  },

  // ==========================================
  // SYSTEM DESIGN & ARCHITECTURE (cs-sys-design)
  // ==========================================
  {
    id: "q-sd-beg-1",
    skillId: "cs-sys-design",
    skillName: "System Design & Distributed Systems",
    category: "Computer Science Fundamentals",
    topic: "Horizontal vs Vertical Scaling",
    difficulty: "beginner",
    question: "What is the key difference between Horizontal and Vertical scaling?",
    options: [
      "Horizontal scaling adds more machines/nodes to the pool; Vertical scaling increases CPU/RAM on a single server",
      "Horizontal scaling only works for CSS stylesheets",
      "Vertical scaling means using microservices across multiple data centers",
      "There is no difference in distributed computing terminology",
    ],
    correctAnswer: 0,
    explanation:
      "Horizontal scaling (scale-out) adds more server instances behind a load balancer, while vertical scaling (scale-up) upgrades the hardware specs of an existing single server.",
    score: 10,
    relatedSkills: ["Cloud Computing", "Computer Science Fundamentals"],
  },
  {
    id: "q-sd-int-1",
    skillId: "cs-sys-design",
    skillName: "System Design & Distributed Systems",
    category: "Computer Science Fundamentals",
    topic: "Caching Strategies",
    difficulty: "intermediate",
    question:
      "In a Cache-Aside (Lazy Loading) caching pattern, how does the application handle a read request?",
    options: [
      "It writes to the database and lets the database notify Redis asynchronously",
      "The app checks the cache; on cache hit it returns data; on cache miss it reads from DB, writes to cache, and returns data",
      "The cache intercepts all network requests at the DNS level",
      "The database is completely bypassed and never receives queries",
    ],
    correctAnswer: 1,
    explanation:
      "In Cache-Aside, the application first checks the cache. If missing, it queries the database, updates the cache for future reads, and returns the response.",
    score: 20,
    relatedSkills: ["Databases & Storage", "Cloud Computing"],
  },
  {
    id: "q-sd-adv-1",
    skillId: "cs-sys-design",
    skillName: "System Design & Distributed Systems",
    category: "Computer Science Fundamentals",
    topic: "CAP Theorem & Partition Tolerance",
    difficulty: "advanced",
    question:
      "According to the CAP theorem, what trade-off must a distributed database make in the event of an unavoidable network partition ($P$)?",
    options: [
      "It can guarantee all three: Consistency, Availability, and Partition Tolerance simultaneously",
      "It must choose between Consistency (refusing requests to avoid stale data) or Availability (serving local responses that might be stale)",
      "It must shut down all storage engines permanently",
      "It must recompile the source code to C++",
    ],
    correctAnswer: 1,
    explanation:
      "Because network partitions are inevitable in distributed networks, a system under partition must choose between Consistency ($CP$) or Availability ($AP$).",
    score: 30,
    relatedSkills: ["Computer Science Fundamentals", "Databases & Storage"],
  },
];
