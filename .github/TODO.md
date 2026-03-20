WARN Attempted to import the module "/home/chyle/project/MiKiko/node_modules/whisper.rn" which is not listed in the "exports" of "/home/chyle/project/MiKiko/node_modules/whisper.rn" under the requested subpath ".". Falling back to file-based resolution. Consider updating the call site or asking the package maintainer(s) to expose this API.
Android Bundling failed 2634ms node_modules/expo-router/entry.js (1 module)
Unable to resolve "./FileSystem.types" from "node_modules/expo-file-system/src/index.ts"
1 | export \* from './FileSystem';

> 2 | export \* from './FileSystem.types';

    |                ^

3 |

Import stack:

node_modules/expo-file-system/src/index.ts
| import "./FileSystem.types"

services/model-manager.ts
| import "expo-file-system"

modules/ai/ai.service.ts
| import "@/services/model-manager"

app/voice.tsx
| import "@/modules/ai/ai.service"

app (require.context)
