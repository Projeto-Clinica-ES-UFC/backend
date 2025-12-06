<!-- This file is designed to be read by LLMs (like Gemini) to understand the project context, constraints, and conventions. -->
<!-- Please preserve the XML-like structure for better parsing efficiency. -->

<project_profile>
    <name>es-clinica-backend</name>
    <description>
        An educational backend project for a clinic management system. 
        It serves as a learning prototype and is not intended for high-scale production use.
        Focus is on functionality, clarity, and separation of concerns.
    </description>
    <environment>
        <os>Linux</os>
        <runtime>Bun</runtime>
    </environment>
</project_profile>

<tech_stack>
    <core>
        <framework>Hono (v4+)</framework>
        <language>TypeScript</language>
        <runtime>Bun</runtime>
    </core>
    <database>
        <engine>SQLite (LibSQL)</engine>
        <orm>Drizzle ORM</orm>
        <migration_tool>Drizzle Kit</migration_tool>
        <schema_location>src/db/schema</schema_location>
    </database>
    <authentication>
        <library>Better Auth</library>
        <strategy>Session-based</strategy>
        <integration>Hono + Drizzle</integration>
    </authentication>
    <validation>
        <library>Zod</library>
    </validation>
    <tooling>
        <linter>Oxlint + ESLint</linter>
        <package_manager>Bun</package_manager>
        <builder>Tsdown</builder>
    </tooling>
</tech_stack>

<architectural_guidelines>
    <pattern>Repository Pattern</pattern>
    <description>
        Strict separation between business logic and data access.
        - **Routes**: Handle HTTP requests/responses (`src/http/routes`).
        - **Services**: specific business logic (`src/http/services`).
        - **Repositories**: Data access interfaces and implementations (`src/http/repository`).
        - **DTOs**: Data Transfer Objects for type safety (`src/http/dto`).
    </description>
    <folder_structure>
        <src>
            <http>
                <routes>API endpoints definition</routes>
                <services>Business logic</services>
                <repository>Data access layer</repository>
                <middlewares>Hono middlewares</middlewares>
            </http>
            <db>
                <schema>Drizzle schema definitions</schema>
                <migrations>SQL migrations</migrations>
            </db>
        </src>
    </folder_structure>
</architectural_guidelines>

<coding_conventions>
    <naming>
        <files>kebab-case (e.g., `user-service.ts`)</files>
        <classes>CamelCase (e.g., `UserService`)</classes>
        <variables>snake_case (e.g., `user_id`)</variables>
        <functions>snake_case (e.g., `get_user_by_id`)</functions>
        <constants>UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)</constants>
    </naming>
    <style>
        <imports>Use path aliases (e.g., `@/http/...`) defined in `tsconfig.json`.</imports>
        <security>
            Address security with a pragmatic, educational approach. 
            Prioritize functionality and clarity over enterprise-grade hardening.
        </security>
    </style>
    <workflow>
        <linting>Run `bun run lint` before committing.</linting>
        <config>Read configuration from `.env` files (safe to read in this context).</config>
    </workflow>
</coding_conventions>

<agent_directives>
    <priority>
        1. Functionality
        2. Code Clarity
        3. Educational Value (Simplicity)
    </priority>
    <constraints>
        - Do NOT over-engineer solutions.
        - Do NOT introduce complex architectural patterns (like CQRS/Event Sourcing) unless explicitly asked.
        - Respect the Folder and File Ignoring Policy.
    </constraints>
    <ignore_paths>
        <path>node_modules/</path>
        <path>.git/</path>
        <path>.idea/</path>
        <path>bun.lockb</path>
        <path>dist/</path>
        <path>coverage/</path>
    </ignore_paths>
</agent_directives>
