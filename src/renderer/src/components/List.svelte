<script lang="ts">
  import { OverlayScrollbarsComponent } from "overlayscrollbars-svelte";
  import { timeToString } from "../lib/time";
  import { createEventDispatcher } from "svelte";

  import { cubicOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";
  import { flip } from "svelte/animate";

  interface Task {
    uuid: string;
    title: string;
    details: string | undefined;
    timestamp: string;
  }

  export let tasks: Task[];

  export let showPastDue: boolean = true;

  const dispatch = createEventDispatcher();

  const [send, receive] = crossfade({
    fallback(node) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;

      return {
        duration: 500,
        easing: cubicOut,
        css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
      };
    },
  });
</script>

<OverlayScrollbarsComponent
  element="div"
  class="h-full"
  options={{ scrollbars: { autoHide: "scroll", theme: "os-theme-light" } }}
  defer
  ><ol class="flex flex-col gap-2">
    {#each tasks as task (task.uuid)}
      {@const match = task.title.match(/^([A-z0-9]+):(.+)$/)}
      {@const pastDue = Date.parse(task.timestamp) < Date.now()}
      <li
        class="relative overflow-hidden bg-base-200 hover:cursor-pointer p-3 rounded-box flex flex-row gap-2"
        class:past-due={showPastDue && pastDue}
        role="presentation"
        on:dblclick={() => {
          dispatch("edit", task.uuid);
        }}
        in:receive={{ key: task.uuid }}
        out:send={{ key: task.uuid }}
        animate:flip
      >
        <div class="flex flex-col gap-1 justify-center">
          <button
            class="btn btn-sm btn-square"
            on:click={() => {
              dispatch("action", task.uuid);
            }}><slot name="action" /></button
          >
        </div>
        <div class="flex flex-col justify-evenly">
          <h2 class="text-xl">
            {#if match}
              <span class="badge badge-outline align-middle">{match[1]}</span>
              {match[2]}
            {:else}
              {task.title}
            {/if}
          </h2>
          {#if task.details}
            <p class="text-neutral-content">{task.details}</p>
          {/if}
          <p class="text-neutral-500">{timeToString(task.timestamp)}</p>
        </div>
      </li>
    {/each}
  </ol></OverlayScrollbarsComponent
>

<style>
  .past-due::after {
    content: "";
    @apply absolute left-0 top-0 bottom-0 w-1 bg-error opacity-100;
  }
</style>
