import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/common/enum/Roles.enum';
import { PropertyStatus } from 'src/common/enum/PropertyStatus';
import { TypeProperty } from 'src/common/enum/TypeProperty.enum';
import { InvitationStatus } from 'src/common/enum/InvitationStatus.enum';
const prisma = new PrismaClient();

async function main() {
    await prisma.companies.create({
        data: {
            name: "AdminCompany",
            companyMailbox: "AdminCompany@gmail.com"
        }
    })
    async function seedAccounts() {
        const createAccountDto = {
            email: 'admin@example.com',
            password: 'adminpassword',
            companyId: 1
        };

        const saltOrRounds = 10;
        const passwordHash = await bcrypt.hash(createAccountDto.password, saltOrRounds);
        const createAccountDtoHash = { ...createAccountDto };
        createAccountDtoHash.password = passwordHash;

        try {
            await prisma.accounts.create({
                data: createAccountDtoHash
            });
            await prisma.users.create({
                data: {
                    "accountId": 1,
                    "isActive": 0,
                    "invitationStatus": "PENDING",
                    "roles": "ADMIN"
                },
            });
            await prisma.users.create({
                data: {
                    "accountId": 1,
                    "isActive": 0,
                    "invitationStatus": "PENDING",
                    "roles": "OWNER"
                },
            });
            await prisma.contacts.create({
                data: {
                    "userId": 1,
                    "email": "example@example.com",
                    "phoneNumber": "0123854123",
                    "taxCode": "23193192321"
                }
            })

            await prisma.properties.create({
                data: {
                    "companyId": 1,
                    "streetLine": "nguyen thi dinh",
                    "status": "AVAILABLE",
                    "type": "BUILDING"
                }
            })
            await prisma.properties.create({
                data: {
                    "companyId": 1,
                    "parentId": 1,
                    "streetLine": "nguyen thi dinh Unit",
                    "status": "AVAILABLE",
                    "type": "UNIT"
                }
            })
            await prisma.user_properties.create({
                data: {
                    usersId: 2,
                    propertiesId: 1,
                }
            })
            await prisma.user_properties.create({
                data: {
                    usersId: 2,
                    propertiesId: 2,
                }
            })
        } catch (error) {
            console.error('Error seeding accounts:', error);
        } finally {
            await prisma.$disconnect();
        }
    }
    seedAccounts();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
