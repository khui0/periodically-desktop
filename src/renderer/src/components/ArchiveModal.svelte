<script lang="ts">
  import Modal from "./Modal.svelte";
  import List from "./List.svelte";

  import TablerArrowBackUp from "~icons/tabler/arrow-back-up";

  let modal: Modal;

  let tasks = [
    {
      "uuid": "e7c3f988-91a8-4aeb-8a50-9015d1dfae91",
      "title": "testingdf",
      "details": "",
      "timestamp": "2024-04-04T23:59",
    },
    {
      "uuid": "1fd4b20a-d095-44c4-8b75-dde3f4aedf0e",
      "title": "sdfs",
      "details": "",
      "timestamp": "2024-04-04T23:59",
    },
    {
      "uuid": "9b1ceeba-99b8-4a20-952b-bcd5e5015ade",
      "title": "this is a test",
      "details": "",
      "timestamp": "2024-04-04T23:59",
    },
  ];

  export function show(): void {
    modal.showModal();
  }
</script>

<Modal title="Archive" bind:this={modal}>
  <div class="flex flex-col gap-2">
    <List
      {tasks}
      on:action={(e) => {
        console.log(e.detail);
      }}
    >
      <span slot="action"><TablerArrowBackUp></TablerArrowBackUp></span>
    </List>
    <button class="btn btn-sm self-center">Clear</button>
  </div>
</Modal>
