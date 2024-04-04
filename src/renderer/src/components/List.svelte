<script lang="ts">
  import { OverlayScrollbarsComponent } from "overlayscrollbars-svelte";
  import { timeToString } from "../lib/time";
  import TablerCheck from "~icons/tabler/check";

  export let tasks: Task[];

  interface Task {
    uuid: string;
    title: string;
    details?: string;
    timestamp: string;
  }

  function deleteTask(uuid: string): void {
    window.electron.ipcRenderer.send("task:delete", uuid);
  }
</script>

<OverlayScrollbarsComponent
  element="span"
  class="h-full"
  options={{ scrollbars: { autoHide: "scroll", theme: "os-theme-light" } }}
  defer
  ><ol class="flex flex-col gap-2">
    {#each tasks as task}
      {@const match = task.title.match(/^([A-z0-9]+):(.+)$/)}
      <li class="bg-base-200 hover:cursor-pointer p-3 rounded-box flex flex-row gap-2">
        <div class="flex flex-col gap-1 justify-center">
          <button
            class="btn btn-sm btn-square"
            on:click={() => {
              deleteTask(task.uuid);
            }}><TablerCheck></TablerCheck></button
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
          {#if Date.parse(task.timestamp) < Date.now()}
            <p class="text-error">{timeToString(task.timestamp)}</p>
          {:else}
            <p class="text-neutral-500">{timeToString(task.timestamp)}</p>
          {/if}
        </div>
      </li>
    {/each}
  </ol></OverlayScrollbarsComponent
>
