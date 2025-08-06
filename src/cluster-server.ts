// src/cluster-server.ts
import cluster from "cluster";
import os from "os";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";
import app from "./app";

dotenv.config({ path: ".env.local" });
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary PID: ${process.pid}`);
  console.log(`${numCPUs} worker başlatılıyor...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} sonlandı. Yeni worker başlatılıyor...`);
    cluster.fork();
  });
} else {
  console.log(`Worker PID: ${process.pid} başlatılıyor...`);

  AppDataSource.initialize()
    .then(() => {
      console.log(` DB bağlantısı başarıyla yapıldı (Worker PID: ${process.pid})`);
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`Express sunucusu çalışıyor (PID: ${process.pid}) - Port: ${port}`);
      });
    })
    .catch((err) => {
      console.error(` DB bağlantı hatası (PID: ${process.pid}):`, err);
    });
}
