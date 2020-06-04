import { PolydockApp } from "./app"
import Wnck from "./types/Wnck-3.0"

Wnck.set_client_type(Wnck.ClientType.PAGER)
Wnck.set_default_icon_size(128)

const argv = [imports.system.programInvocationName].concat(ARGV)

const app = new PolydockApp()
const status = app.run(argv)
imports.system.exit(status)
