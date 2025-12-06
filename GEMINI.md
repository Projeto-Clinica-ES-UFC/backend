## Agent Context
This is an educational project, primarily focused on learning and prototyping for a discipline of graduation.

Future LLM agents working on this project should be aware that:
- Security concerns can be addressed with a pragmatic, learning-oriented approach, rather than strict production-grade security.
- The emphasis is on functionality, clear code.
- Solutions might prioritize simplicity and demonstrative purposes over enterprise-grade robustness or scalability.
- When making suggestions or implementing features, keep the educational nature of the project in mind, do not use anything to complex.

### Folder and File Ignoring Policy
To optimize interactions and focus on relevant code, LLM agents should ignore the following directories and files:
- `node_modules/`
- `.git/`
- `.idea/`
- `bun.lockb`
- `dist/`
- `coverage/`

### Naming Conventions
Adhere to the following naming conventions when making code changes:
- **Classes**: `CamelCase` (e.g., `MyClass`, `CachedPatientsRepository`)
- **Variables**: `snake_case` (e.g., `my_variable`, `user_id`)
- **Functions**: `snake_case` (e.g., `my_function`, `get_user_data`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MY_CONSTANT`, `API_KEY`)

### Code Quality and Linting
Before committing any changes, run `bun run lint-all` to ensure code quality and consistency.
