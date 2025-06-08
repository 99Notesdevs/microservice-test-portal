const { PrismaClient } = require("@prisma/client");

const updateRatings = async () => {
    const prisma = new PrismaClient();
    const questions = await prisma.questionBank.findMany({
        select: {
            id: true,
            totalAttempts: true,
            correctAttempts: true,
        }
    });

    for (const question of questions) {
        const { id, totalAttempts, correctAttempts } = question;
        let rating = null;

        if(!totalAttempts || !correctAttempts) {
            continue;
        }

        if( totalAttempts > 0) {
            rating = -(5000.0/3.0) * (Math.log(correctAttempts / totalAttempts) / Math.log(2));
            await prisma.questionBank.update({
                where: { id },
                data: { rating },
            });
        }

    }
    return { success: true };
}

updateRatings();