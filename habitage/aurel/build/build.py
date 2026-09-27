"""Build aurel/aurel.js — the website's live Aurel — from the app's own Aurel.

    python3 aurel/build/build.py

Reads (never writes) the Flutter repo: docs/shared/aurel.js + aurel_pose.js (his
skinning, shading, face, halo), the lab shader via docs/shared/buildkit.py, and
the baked docs/shared/aurel_mesh.js (copied beside aurel.js). Refuses a stale
bake exactly as the app's builds do, so the site can never show an old Aurel.
"""
import json, os, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
FLUTTER = os.environ.get('HABITAGE_FLUTTER', '/Users/jeetpatel/Documents/PROJECTS/IOS-PROJECTS/HabitageFlutter')
SHARED = os.path.join(FLUTTER, 'docs/shared')
sys.path.insert(0, SHARED)
from buildkit import aurel_glsl, resolve  # noqa: E402

import hashlib  # noqa: E402
lab = open(os.path.join(FLUTTER, 'docs/character/aurel-lab/template.html')).read()
tag = '<script id="fs" type="x-shader/x-fragment">'
want = hashlib.sha1(lab[lab.index(tag) + len(tag):].split('</script>')[0].encode()).hexdigest()[:12]
mesh = os.path.join(SHARED, 'aurel_mesh.js')
if f"lab: '{want}'" not in open(mesh).read():
    raise SystemExit("Aurel's lab shader changed since his mesh was baked — rebake in the app repo first.")

engine = resolve(open(os.path.join(SHARED, 'aurel.js')).read())
# Up close the halo is ~2000 px across; the app's 192² halo target (sized for a
# small, distant Aurel) would be upscaled 10x and ripple along his silhouette.
# The blur is defined in world units (σ = 2.6 cm), so a finer target changes only
# the sharpness, never the look.
assert engine.count('const HALO_N = 192,') == 1
engine = engine.replace('const HALO_N = 192,', 'const HALO_N = 384,')
# ...and its silhouette mask is multisampled, so the halo's inner edge is as
# smooth as his antialiased outline instead of a stair-step fringe.
RT = "const haloRT = [0, 1, 2].map(() => { const t = new THREE.WebGLRenderTarget(HALO_N, HALO_N, { depthBuffer: true });"
assert engine.count(RT) == 1
engine = engine.replace(RT, "const haloRT = [0, 1, 2].map(i => { const t = new THREE.WebGLRenderTarget(HALO_N, HALO_N, { depthBuffer: true, samples: i ? 0 : 4 });")
src = open(os.path.join(HERE, 'aurel.src.js')).read()
out = src.replace('/*@@AUREL_ENGINE@@*/\n', engine).replace('__AUREL_GLSL__', json.dumps(aurel_glsl()))
assert '__AUREL_GLSL__' not in out and '/*@@' not in out
open(os.path.join(OUT, 'aurel.js'), 'w').write(out)
shutil.copy(mesh, os.path.join(OUT, 'aurel_mesh.js'))
print('wrote aurel.js (%d KB) + aurel_mesh.js (%d KB), lab %s' % (len(out) // 1024, os.path.getsize(mesh) // 1024, want))
