-- ==============================================================================
-- Migration: 019_assessment_question_seeds.sql
-- Description: Standard seed data for question bank and options mapped to Phase 2.2 skills taxonomy.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.seed_question_with_options(
  s_slug TEXT,
  q_topic TEXT,
  q_diff public.question_difficulty,
  q_text TEXT,
  q_explanation TEXT,
  q_points INT,
  opt_texts TEXT[],
  correct_idx INT
) RETURNS VOID AS $$
DECLARE
  v_skill_id UUID;
  v_cat_id UUID;
  v_q_id UUID;
  i INT;
BEGIN
  SELECT id, category_id INTO v_skill_id, v_cat_id FROM public.skills WHERE slug = s_slug OR name ILIKE s_slug LIMIT 1;
  IF v_skill_id IS NULL THEN RETURN; END IF;

  INSERT INTO public.assessment_questions (
    skill_id,
    category_id,
    topic,
    question_text,
    explanation,
    difficulty,
    question_type,
    score_value,
    status
  ) VALUES (
    v_skill_id,
    v_cat_id,
    q_topic,
    q_text,
    q_explanation,
    q_diff,
    'mcq',
    q_points,
    'active'
  )
  RETURNING id INTO v_q_id;

  FOR i IN 1..array_length(opt_texts, 1)
  LOOP
    INSERT INTO public.assessment_question_options (
      question_id,
      option_key,
      option_text,
      is_correct,
      display_order
    ) VALUES (
      v_q_id,
      (i - 1)::TEXT,
      opt_texts[i],
      (i - 1) = correct_idx,
      i - 1
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 1. REACT QUESTIONS (web-react)
SELECT public.seed_question_with_options(
  'web-react', 'JSX & Props', 'beginner',
  'In React, what is the primary purpose of passing `props` to a component?',
  'Props are immutable, read-only inputs passed from parent to child components.',
  10,
  ARRAY[
    'To directly mutate the internal DOM tree of another component',
    'To pass arbitrary read-only data and callback handlers from a parent to a child component',
    'To trigger a synchronous full-page browser refresh',
    'To store global variables inside browser local storage'
  ],
  1
);

SELECT public.seed_question_with_options(
  'web-react', 'useState Hook', 'beginner',
  'How should you update state in React when the new state value depends on the previous state value?',
  'Functional updater setCount(prev => prev + 1) ensures stale closures are avoided during batched updates.',
  10,
  ARRAY[
    'Mutate state.count = state.count + 1 directly',
    'Call setCount((prevCount) => prevCount + 1) with a functional updater',
    'Re-render the root DOM tree with ReactDOM.render',
    'Call this.forceUpdate() inside the functional component'
  ],
  1
);

SELECT public.seed_question_with_options(
  'web-react', 'useEffect Hook', 'intermediate',
  'When does the cleanup function returned inside a `useEffect` callback execute?',
  'The cleanup executes before the component unmounts and before re-running the effect on dependency change.',
  20,
  ARRAY[
    'Only when the entire browser window is closed',
    'Before the component unmounts and prior to re-running the effect on dependency updates',
    'Immediately before JSX finishes compilation',
    'Whenever a network request returns HTTP 200'
  ],
  1
);

SELECT public.seed_question_with_options(
  'web-react', 'useCallback & useMemo', 'intermediate',
  'What is the primary operational distinction between `useMemo` and `useCallback`?',
  'useMemo caches computed values; useCallback caches function definitions.',
  20,
  ARRAY[
    'useMemo runs on the server while useCallback runs in Web Workers',
    'useMemo memoizes the computed return value of a function; useCallback memoizes the function definition itself',
    'useMemo is exclusively for class components; useCallback is for functional components',
    'useCallback triggers automatic network caching; useMemo does not'
  ],
  1
);

SELECT public.seed_question_with_options(
  'web-react', 'Concurrent React', 'advanced',
  'What is the primary benefit of wrapping non-urgent state updates in `startTransition` in React 18+?',
  'startTransition marks updates as interruptible so urgent interactions like typing remain at 60fps.',
  30,
  ARRAY[
    'It converts client React code to WebAssembly binaries',
    'It marks state updates as low-priority, allowing urgent user interactions to interrupt the render',
    'It bypasses all React reconciliation checks and writes directly to innerHTML',
    'It forces components to execute strictly on a backend worker thread'
  ],
  1
);

-- 2. TYPESCRIPT QUESTIONS (lang-typescript)
SELECT public.seed_question_with_options(
  'lang-typescript', 'Type Inference & Generics', 'beginner',
  'What is the main advantage of TypeScript generics over using the `any` type?',
  'Generics preserve compile-time type safety and parameter relationships whereas any disables type checking.',
  10,
  ARRAY[
    'Generics automatically minify JavaScript output at runtime',
    'Generics retain compile-time type safety while allowing flexible, reusable code structures',
    'Generics convert interpreted JavaScript into multi-threaded assembly',
    'Generics disable strict mode checks in tsconfig.json'
  ],
  1
);

SELECT public.seed_question_with_options(
  'lang-typescript', 'Discriminated Unions', 'intermediate',
  'What characterizes a Discriminated Union in TypeScript?',
  'A union of object types that share a common literal tag property used for type narrowing.',
  20,
  ARRAY[
    'A union type that only accepts primitive numeric constants',
    'A union of object types sharing a common literal property used by TypeScript to narrow types',
    'A type assertion syntax using the `as unknown as Type` pattern',
    'A class implementing multiple abstract interfaces simultaneously'
  ],
  1
);

SELECT public.seed_question_with_options(
  'lang-typescript', 'Conditional Types', 'advanced',
  'What does the `infer` keyword accomplish within a TypeScript conditional type?',
  'infer introduces a type variable to be deduced within the conditional type expression.',
  30,
  ARRAY[
    'It forces the compiler to guess missing variable definitions at runtime',
    'It declares a type variable to be extracted and deduced within the true branch of a conditional type',
    'It imports external ambient declarations from npm packages',
    'It converts a promise type into a synchronous blocking call'
  ],
  1
);

-- 3. JAVASCRIPT QUESTIONS (lang-javascript)
SELECT public.seed_question_with_options(
  'lang-javascript', 'Event Loop & Concurrency', 'intermediate',
  'In the JavaScript event loop, in what order are Microtasks (e.g. Promise.then) and Macrotasks (e.g. setTimeout) processed?',
  'Microtask queue is fully drained after the current synchronous frame and before the next macrotask is dequeued.',
  20,
  ARRAY[
    'Macrotasks always execute before microtasks regardless of queue state',
    'All queued microtasks are completely executed before the event loop picks the next macrotask',
    'Both queues execute in parallel on separate operating system threads',
    'Microtasks only execute when requestAnimationFrame fires'
  ],
  1
);

SELECT public.seed_question_with_options(
  'lang-javascript', 'Closures & Scope', 'beginner',
  'What is a closure in JavaScript?',
  'A closure is the combination of a function bundled together with references to its surrounding lexical environment.',
  10,
  ARRAY[
    'A syntax error that prevents functions from being invoked',
    'A function that retains access to variables from its outer lexical scope even after that outer scope has closed',
    'An encrypted cryptographic hash generated by the V8 engine',
    'A method to terminate an infinite loop immediately'
  ],
  1
);

-- 4. PYTHON QUESTIONS (lang-python)
SELECT public.seed_question_with_options(
  'lang-python', 'Decorators & Generators', 'intermediate',
  'What is the primary memory advantage of a Python generator using `yield` compared to returning a full `list`?',
  'Generators evaluate lazily one item at a time with O(1) memory instead of allocating the entire collection in memory.',
  20,
  ARRAY[
    'Generators run in parallel across all CPU cores automatically',
    'Generators produce items on demand with O(1) space complexity without storing the entire dataset in RAM',
    'Generators encrypt variables to protect memory from inspection',
    'Generators compile directly into C extensions during execution'
  ],
  1
);

SELECT public.seed_question_with_options(
  'lang-python', 'Global Interpreter Lock (GIL)', 'advanced',
  'What is the impact of CPython GIL on multi-threaded CPU-bound programs?',
  'The GIL prevents multiple native threads from executing Python bytecodes concurrently on multiple CPU cores.',
  30,
  ARRAY[
    'It guarantees that Python threads run faster than C++ threads',
    'It ensures only one thread executes Python bytecode at a time, limiting CPU-bound concurrency to a single core',
    'It replaces operating system memory allocators with garbage collection pools',
    'It automatically distributes workload across a cluster of server machines'
  ],
  1
);

-- 5. SQL & POSTGRESQL (lang-sql, db-postgresql)
SELECT public.seed_question_with_options(
  'lang-sql', 'Joins & Aggregations', 'beginner',
  'What is the difference between `WHERE` and `HAVING` clauses in SQL?',
  'WHERE filters rows before aggregation; HAVING filters aggregated groups.',
  10,
  ARRAY[
    'WHERE is for PostgreSQL; HAVING is only for MySQL',
    'WHERE filters individual rows before aggregation; HAVING filters groups after the GROUP BY aggregation',
    'HAVING cannot be used with aggregate functions like COUNT() or SUM()',
    'WHERE sorts records ascending; HAVING sorts records descending'
  ],
  1
);

SELECT public.seed_question_with_options(
  'lang-sql', 'Indexing & Query Optimization', 'intermediate',
  'Why can a B-Tree index become ineffective when applying a function to an indexed column (e.g. `WHERE LOWER(email) = ?`)?',
  'Standard B-Tree indexes cannot be used unless an expression/functional index is explicitly created.',
  20,
  ARRAY[
    'Because SQL databases disable all indexes whenever strings are compared',
    'The database must evaluate the function row-by-row on the fly unless a functional/expression index is created',
    'Functions in WHERE clauses cause an immediate database dead-lock',
    'B-Trees only support integer comparisons, not text columns'
  ],
  1
);

SELECT public.seed_question_with_options(
  'db-postgresql', 'ACID Transactions & Isolation', 'advanced',
  'Under the `READ COMMITTED` transaction isolation level in PostgreSQL, which anomaly is still possible?',
  'Non-repeatable reads (where a query re-read in the same transaction sees modified committed data) can occur.',
  30,
  ARRAY[
    'Dirty Reads (reading uncommitted modified data)',
    'Non-repeatable Reads (re-reading a row in the same transaction yields updated data committed by another transaction)',
    'Database buffer corruption',
    'Automatic rollback of all concurrent transactions'
  ],
  1
);

-- 6. DATA STRUCTURES & ALGORITHMS (cs-dsa)
SELECT public.seed_question_with_options(
  'cs-dsa', 'Time Complexity & Hash Maps', 'beginner',
  'What is the average case time complexity for search, insertion, and deletion in a Hash Table?',
  'With a good hash function and load factor, hash table lookups are O(1) average time.',
  10,
  ARRAY[
    'O(N)',
    'O(1)',
    'O(log N)',
    'O(N log N)'
  ],
  1
);

SELECT public.seed_question_with_options(
  'cs-dsa', 'Graph Traversal', 'intermediate',
  'Which data structure is typically utilized to implement Breadth-First Search (BFS) on a graph?',
  'BFS uses a FIFO Queue to visit neighbors level by level.',
  20,
  ARRAY[
    'LIFO Stack',
    'FIFO Queue',
    'Priority Max-Heap',
    'Binary Search Tree'
  ],
  1
);

SELECT public.seed_question_with_options(
  'cs-dsa', 'Dynamic Programming', 'advanced',
  'What are the two foundational properties required for a problem to be solvable via Dynamic Programming?',
  'Optimal Substructure (optimal solution built from optimal subproblems) and Overlapping Subproblems.',
  30,
  ARRAY[
    'Linear Time Complexity and Constant Memory',
    'Optimal Substructure and Overlapping Subproblems',
    'Asymptotic Equivalence and Sorting Invariants',
    'Greedy Choice Property and Complete Bipartiteness'
  ],
  1
);

-- 7. COMPUTER NETWORKS & OPERATING SYSTEMS (cs-networking, cs-os)
SELECT public.seed_question_with_options(
  'cs-networking', 'TCP vs UDP', 'beginner',
  'Why does TCP establish a three-way handshake (SYN, SYN-ACK, ACK) before data transfer?',
  'To synchronize sequence numbers, verify bi-directional connectivity, and establish a reliable session.',
  10,
  ARRAY[
    'To encrypt HTTP headers with AES-256 keys',
    'To synchronize initial sequence numbers and confirm bi-directional transmission capability before streaming payload',
    'To assign an IPv6 address to the client adapter',
    'To notify the DNS server that a domain is active'
  ],
  1
);

SELECT public.seed_question_with_options(
  'cs-os', 'Process vs Thread', 'intermediate',
  'What is the primary distinction between a Process and a Thread in modern operating systems?',
  'Processes have isolated virtual address spaces; threads within the same process share heap, code, and address space.',
  20,
  ARRAY[
    'Processes share RAM directly; threads have completely isolated physical memory',
    'Processes have independent virtual address spaces; threads within a process share the same memory address space and file descriptors',
    'Threads can only run in single-core processors; processes require multi-core architectures',
    'Processes cannot communicate with other processes over networks'
  ],
  1
);

-- 8. GIT & DEVOPS (devops-git, devops-docker)
SELECT public.seed_question_with_options(
  'devops-git', 'Git Merge vs Rebase', 'intermediate',
  'What happens when you perform `git rebase main` on your feature branch?',
  'Your feature branch commits are lifted and re-applied sequentially onto the tip of main, producing a linear history.',
  20,
  ARRAY[
    'It permanently destroys all remote commits on origin/main',
    'It reapplies your feature branch commits sequentially on top of the latest commit of the main branch, creating a linear history',
    'It generates a three-way merge commit with two parent commit hashes',
    'It reverts all unstaged local file modifications'
  ],
  1
);

SELECT public.seed_question_with_options(
  'devops-docker', 'Container Layers & Caching', 'intermediate',
  'Why should Dockerfile instructions that change frequently (such as `COPY . .`) be placed toward the bottom of the Dockerfile?',
  'Placing frequently modified instructions late preserves cached earlier layers (like package installation), speeding up image builds.',
  20,
  ARRAY[
    'Because Docker only parses the last 5 lines of a Dockerfile',
    'To maximize Docker layer caching and avoid invalidating earlier expensive layers like dependency installations',
    'Because Linux kernels forbid copying files before setting the entrypoint',
    'To prevent the container from consuming swap space'
  ],
  1
);

-- 9. ARTIFICIAL INTELLIGENCE & ML (ai-machine-learning)
SELECT public.seed_question_with_options(
  'ai-machine-learning', 'Overfitting & Regularization', 'intermediate',
  'What is the primary goal of applying L2 Regularization (Ridge) to a linear or neural network model?',
  'L2 regularization penalizes large weights with a squared penalty, preventing excessive sensitivity to training noise.',
  20,
  ARRAY[
    'To eliminate all bias in the dataset completely',
    'To penalize large model weights by adding a squared magnitude term to the loss function, reducing model variance and overfitting',
    'To force the model weights to become exactly zero (sparse feature selection)',
    'To increase the learning rate exponentially during training'
  ],
  1
);

-- Clean up helper function
DROP FUNCTION IF EXISTS public.seed_question_with_options;

