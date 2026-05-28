import type { Plugin } from "@opencode-ai/plugin";
import { createId as cuid2 } from "@paralleldrive/cuid2";

import { events } from "./db-schema";
import { closeDb, db } from "./utils/db";
import { logger } from "./utils/logger";

export const AbstackPlugin: Plugin = async ({
  project,
  directory,
  worktree,
  serverUrl,
}) => {
  logger.startup();
  logger.info("plugin:init", { directory, project, serverUrl, worktree });

  return {
    // config: (config) => {
    //   console.log(config);
    // },
    dispose: async () => {
      logger.info("plugin:dispose");
      closeDb();
    },
    event: async ({ event }) => {
      const { type, properties } = event;

      let cardinal = true;
      let data: object = properties;

      // Ignore certain event types
      if (
        [
          "message.part.delta",
          "server.instance.disposed",
          "message.part.updated",
        ].includes(type)
      ) {
        return;
      }

      // Add cardinal=false for certain event types
      if (
        type === "lsp.client.diagnostics" &&
        Object.keys(properties).length === 2
      ) {
        cardinal = false;
      } else if (
        type === "lsp.updated" &&
        Object.keys(properties).length === 0
      ) {
        cardinal = false;
      } else if (
        type === "session.idle" &&
        Object.keys(properties).length === 1
      ) {
        cardinal = false;
      } else if (type === "session.diff" && properties.diff.length === 0) {
        cardinal = false;
      }

      // Restructure data for certain events
      if (type === "todo.updated") {
        data = properties.todos;
      } else if (type === "session.updated") {
        const { agent, title, model, summary, tokens } = properties.info;
        // model, summary, tokens
        data = { agent, title };
      }
      // else if (type === "session.next.agent.switched") {
      //   data = { agent: properties.agent };
      // }

      const timestamp = new Date();
      const id = cuid2();
      logger.info("event", { properties, type });
      const sessionId = properties?.sessionID;
      db.insert(events)
        .values({ id, sessionId, data, cardinal, timestamp, type })
        .run();
    },
    // tool: {
    // 	"custom-tool": {},
    // },
  };
};

// Command Events
//     command.executed
// File Events
//     file.edited
//     file.watcher.updated
// Installation Events
//     installation.updated
// LSP Events
//     lsp.client.diagnostics
//     lsp.updated
// Message Events
//     message.part.removed
//     message.part.updated
//     message.removed
//     message.updated
// Permission Events
//     permission.asked
//     permission.replied
// Server Events
//     server.connected
// Session Events
//     session.created
//     session.compacted
//     session.deleted
//     session.diff
//     session.error
//     session.idle
//     session.status
//     session.updated
// Todo Events
//     todo.updated
// Shell Events
//     shell.env
// Tool Events
//     tool.execute.after
//     tool.execute.before
// TUI Events
//     tui.prompt.append
//     tui.command.execute
//     tui.toast.show

// export const CustomCompactionPlugin: Plugin = async (ctx) => {
//   return {
//     "experimental.session.compacting": async (input, output) => {
//       // Replace the entire compaction prompt
//       output.context.push(`
// ## Custom Context

// Include any state that should persist across compaction:
// - Current task status
// - Important decisions made
// - Files being actively worked on
// `)
//       output.prompt = `
// You are generating a continuation prompt for a multi-agent swarm session.

// Summarize:
// 1. The current task and its status
// 2. Which files are being modified and by whom
// 3. Any blockers or dependencies between agents
// 4. The next steps to complete the work

// Format as a structured prompt that a new agent can use to resume work.
// `
//     },
//   }
// }
// --------------------------------
// /**
//  * Called when a new message is received
//  */
// "chat.message"?: (input: {
//     sessionID: string;
//     agent?: string;
//     model?: {
//         providerID: string;
//         modelID: string;
//     };
//     messageID?: string;
//     variant?: string;
// }, output: {
//     message: UserMessage;
//     parts: Part[];
// }) => Promise<void>;
// /**
//  * Modify parameters sent to LLM
//  */
// "chat.params"?: (input: {
//     sessionID: string;
//     agent: string;
//     model: Model;
//     provider: ProviderContext;
//     message: UserMessage;
// }, output: {
//     temperature: number;
//     topP: number;
//     topK: number;
//     maxOutputTokens: number | undefined;
//     options: Record<string, any>;
// }) => Promise<void>;
// "chat.headers"?: (input: {
//     sessionID: string;
//     agent: string;
//     model: Model;
//     provider: ProviderContext;
//     message: UserMessage;
// }, output: {
//     headers: Record<string, string>;
// }) => Promise<void>;
// "permission.ask"?: (input: Permission, output: {
//     status: "ask" | "deny" | "allow";
// }) => Promise<void>;
// "command.execute.before"?: (input: {
//     command: string;
//     sessionID: string;
//     arguments: string;
// }, output: {
//     parts: Part[];
// }) => Promise<void>;
// "tool.execute.before"?: (input: {
//     tool: string;
//     sessionID: string;
//     callID: string;
// }, output: {
//     args: any;
// }) => Promise<void>;
// "shell.env"?: (input: {
//     cwd: string;
//     sessionID?: string;
//     callID?: string;
// }, output: {
//     env: Record<string, string>;
// }) => Promise<void>;
// "tool.execute.after"?: (input: {
//     tool: string;
//     sessionID: string;
//     callID: string;
//     args: any;
// }, output: {
//     title: string;
//     output: string;
//     metadata: any;
// }) => Promise<void>;
// "experimental.chat.messages.transform"?: (input: {}, output: {
//     messages: {
//         info: Message;
//         parts: Part[];
//     }[];
// }) => Promise<void>;
// "experimental.chat.system.transform"?: (input: {
//     sessionID?: string;
//     model: Model;
// }, output: {
//     system: string[];
// }) => Promise<void>;
// /**
//  * Called before session compaction starts. Allows plugins to customize
//  * the compaction prompt.
//  *
//  * - `context`: Additional context strings appended to the default prompt
//  * - `prompt`: If set, replaces the default compaction prompt entirely
//  */
// "experimental.session.compacting"?: (input: {
//     sessionID: string;
// }, output: {
//     context: string[];
//     prompt?: string;
// }) => Promise<void>;
// /**
//  * Called after compaction succeeds and before a synthetic user
//  * auto-continue message is added.
//  *
//  * - `enabled`: Defaults to `true`. Set to `false` to skip the synthetic
//  *   user "continue" turn.
//  */
// "experimental.compaction.autocontinue"?: (input: {
//     sessionID: string;
//     agent: string;
//     model: Model;
//     provider: ProviderContext;
//     message: UserMessage;
//     overflow: boolean;
// }, output: {
//     enabled: boolean;
// }) => Promise<void>;
// "experimental.text.complete"?: (input: {
//     sessionID: string;
//     messageID: string;
//     partID: string;
// }, output: {
//     text: string;
// }) => Promise<void>;
// /**
//  * Modify tool definitions (description and parameters) sent to LLM
//  */
// "tool.definition"?: (input: {
//     toolID: string;
// }, output: {
//     description: string;
//     parameters: any;
// }) => Promise<void>;
