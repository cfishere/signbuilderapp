// Normalizes Fabric’s export shape across bundlers
import * as FabricNS from 'fabric'

// Some builds expose { fabric: {...} }; others expose the API at top level
export const fabric: any = (FabricNS as any).fabric ?? (FabricNS as any)

export default fabric
