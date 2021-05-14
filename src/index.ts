import {$log} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server";
import * as fs from 'fs';
import { firebaseAdminInitialized } from "./utilities/FirebaseAdminInitialize";

async function bootstrap() {
  try {
    
    firebaseAdminInitialized()

    $log.debug("Start server...");
    const platform = await PlatformExpress.bootstrap(Server);

    await platform.listen();
    $log.debug("Server initialized");

    const tmp_dir = `${__dirname}/../storage/tmp`;
    if(!fs.existsSync(tmp_dir)) {
      fs.mkdirSync(tmp_dir)
    }

    const upload_dir = `${__dirname}/../storage/uploads`;
    if(!fs.existsSync(upload_dir)) {
      fs.mkdirSync(upload_dir)
    }

  } catch (er) {
    $log.error(er);
  }
}

bootstrap();
