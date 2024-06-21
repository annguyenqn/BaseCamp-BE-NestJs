-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'PENDING', 'SOLD', 'CANCELED', 'MAINTENANCE', 'RENTED');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'PROPERTY_MANAGER', 'OWNER', 'COMPANY_OWNER', 'TENANT');

-- CreateEnum
CREATE TYPE "TypeProperty" AS ENUM ('BUILDING', 'UNIT');

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "isActive" INTEGER NOT NULL,
    "invitationStatus" "InvitationStatus" NOT NULL,
    "roles" "Roles" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_properties" (
    "id" SERIAL NOT NULL,
    "usersId" INTEGER NOT NULL,
    "propertiesId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_properties_contacts" (
    "id" SERIAL NOT NULL,
    "userPropertyId" INTEGER NOT NULL,
    "contactsId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_properties_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "taxCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "companyMailbox" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "streetLine" TEXT NOT NULL,
    "status" "PropertyStatus" NOT NULL,
    "type" "TypeProperty" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otps" (
    "id" SERIAL NOT NULL,
    "otpCode" VARCHAR(10) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_companyMailbox_key" ON "companies"("companyMailbox");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_properties" ADD CONSTRAINT "user_properties_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_properties" ADD CONSTRAINT "user_properties_propertiesId_fkey" FOREIGN KEY ("propertiesId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_properties_contacts" ADD CONSTRAINT "user_properties_contacts_userPropertyId_fkey" FOREIGN KEY ("userPropertyId") REFERENCES "user_properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_properties_contacts" ADD CONSTRAINT "user_properties_contacts_contactsId_fkey" FOREIGN KEY ("contactsId") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;
