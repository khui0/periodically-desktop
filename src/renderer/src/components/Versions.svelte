<script lang="ts">
  const version: string = import.meta.env.PACKAGE_VERSION;
  const versions = window.electron.process.versions;
</script>

<div class="flex flex-row justify-evenly gap-x-2 flex-wrap text-neutral-content">
  <p>Periodically {version}</p>
  <p>Electron {versions.electron}</p>
  <p>Chromium {versions.chrome}</p>
  <p>Node {versions.node}</p>
</div>
