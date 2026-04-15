-- CreateEnum
CREATE TYPE "CallType" AS ENUM ('audio', 'video');

-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('scheduled', 'ringing', 'in_progress', 'ended');

-- CreateEnum
CREATE TYPE "CallSignalType" AS ENUM ('ring', 'offer', 'answer', 'ice', 'hangup');

-- CreateTable
CREATE TABLE "CallRoom" (
    "id" TEXT NOT NULL,
    "consultationId" TEXT NOT NULL,
    "hostUserId" TEXT NOT NULL,
    "participantUserIds" TEXT[] NOT NULL,
    "scheduledFor" TIMESTAMP(3),
    "type" "CallType" NOT NULL DEFAULT 'video',
    "status" "CallStatus" NOT NULL DEFAULT 'scheduled',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CallRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallSignal" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT,
    "type" "CallSignalType" NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CallSignal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CallRoom_consultationId_key" ON "CallRoom"("consultationId");

-- AddForeignKey
ALTER TABLE "CallRoom" ADD CONSTRAINT "CallRoom_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallSignal" ADD CONSTRAINT "CallSignal_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "CallRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
