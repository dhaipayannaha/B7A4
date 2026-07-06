import app from "./app";
import config from "./config";

const PORT = Number(config.PORT) || 5000;
async function main() {
    try {
        // await prisma.$connect();
        console.log("Database connected");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
        // await prisma.$disconnect();
        process.exit(1);
    }
}
main();