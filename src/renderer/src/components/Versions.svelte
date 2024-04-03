<script lang="ts">
  const versions = window.electron.process.versions;
</script>

<div class="flex flex-row gap-4 bg-base-200 w-fit px-4 py-2 rounded-full">
  <p>Electron {versions.electron}</p>
  <p>Chromium {versions.chrome}</p>
  <p>Node {versions.node}</p>
</div>
