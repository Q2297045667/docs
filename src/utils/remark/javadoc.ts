import type { RemarkPlugin } from "@astrojs/markdown-remark";
import { deadOrAlive } from "dead-or-alive";
import { visit } from "unist-util-visit";

// replaces special Markdown links with Javadoc URLs
// link format: jd:<javadoc name>[:<module name>][:<fully qualified class name; . as package separator, $ for inner>]

interface Target {
  url: string;
  module?: string; // default
}

interface Options {
  targets: Record<string, string | Target>;
}

const asUrl = (name: string): string => {
  let [name0, hash] = name.split("#", 2);
  name0 = name0.replaceAll(".", "/").replaceAll("$", ".");

  return `${name0}.html` + (hash ? `#${hash}` : "");
};

const parse = async (url: string, { targets }: Options): Promise<string | null> => {
  const match = /^jd:(.+?)(?::(.+?))?(?::(.+?))?$/.exec(url);
  if (!match) {
    return null;
  }

  const target = targets[match[1]];
  if (!target) {
    return null;
  }

  const targetUrl = typeof target !== "string" ? target.url : target;

  const name = match[3] ?? match[2];
  if (!name) {
    return targetUrl;
  }

  const module = match[3] ? match[2] : typeof target !== "string" ? target.module : undefined;

  const parsed: string = `${targetUrl}/${module ? `${module}/` : ""}${asUrl(name)}`;

  const result = await deadOrAlive(parsed, {
    findUrls: false,
    followMetaHttpEquiv: false,
    userAgent: "PaperMC/docs (https://paper.8aka.org)",
  });
  if (result.status !== "alive") {
    const error = new Error(`Javadoc 链接 "${url}" 无效`);
    if (process.env.NODE_ENV === "production") {
      console.error(error);

      // throwing an error does not exit the build process, it silently fails
      // we don't want missing pages, so exit the process instead
      process.exit(1);
    } else {
      throw error;
    }
  }

  return parsed;
};

const plugin: RemarkPlugin = (options: Options) => {
  return async (tree) => {
    const promises: Promise<void>[] = [];
    visit(tree, "link", (node) => {
      promises.push(
        parse(node.url, options).then((url) => {
          node.url = url ?? node.url;
        })
      );
    });
    await Promise.all(promises);
  };
};

export default plugin;
