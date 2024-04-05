<script lang="ts">
  const versions = window.electron.process.versions;
</script>

<div class="flex flex-row justify-evenly gap-2 flex-wrap">
  <p>Electron {versions.electron}</p>
  <p>Chromium {versions.chrome}</p>
  <p>Node {versions.node}</p>
</div>
