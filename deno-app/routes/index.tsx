/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "fresh/server.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    return ctx.render({});
  },
};

export default function Home(_props: PageProps) {
  return (
    <div className="p-6 mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">Deno + Fresh alongside Node</h1>
      <p className="mt-4">This is a minimal scaffold — expand routes and islands as needed.</p>
    </div>
  );
}
