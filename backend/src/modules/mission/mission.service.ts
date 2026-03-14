import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class MissionService {
  constructor(private readonly prisma: PrismaService) {}

  async getDailyMissions(userId: number) {
    const missions = await this.prisma.mission.findMany({
      where: { isActive: true },
    });

    const today = new Date();
    today.setHours(today.getHours() + 7); // Adjust timezone to UTC+7 for VN (or use UTC midnight)
    today.setUTCHours(0, 0, 0, 0);

    const userMissions = await this.prisma.userMission.findMany({
      where: {
        userId,
        // Match the same date structure
        date: today,
      },
    });

    return missions.map(mission => {
      const userMission = userMissions.find(um => um.missionId === mission.id);
      return {
        ...mission,
        progress: userMission ? userMission.progress : 0,
        isCompleted: userMission ? userMission.isCompleted : false,
      };
    });
  }

  async updateProgress(userId: number, addMinutes: number) {
     const today = new Date();
     today.setHours(today.getHours() + 7);
     today.setUTCHours(0, 0, 0, 0);

     const activeMissions = await this.prisma.mission.findMany({
         where: { isActive: true, type: 'ONLINE_TIME' }
     });

     let totalReward = 0;
     const updatedMissions = [];

     for (const mission of activeMissions) {
        let userMission = await this.prisma.userMission.findUnique({
            where: {
                userId_missionId_date: {
                    userId,
                    missionId: mission.id,
                    date: today
                }
            }
        });

        if (!userMission) {
            userMission = await this.prisma.userMission.create({
                data: {
                    userId,
                    missionId: mission.id,
                    date: today,
                    progress: 0,
                    isCompleted: false
                }
            });
        }

        if (userMission.isCompleted) {
            continue; // Already completed, skip
        }

        const newProgress = userMission.progress + addMinutes;
        const isCompleted = newProgress >= mission.requirement;

        await this.prisma.userMission.update({
            where: { id: userMission.id },
            data: {
                progress: newProgress,
                isCompleted,
                completedAt: isCompleted ? new Date() : null
            }
        });

        if (isCompleted) {
            totalReward += mission.rewardAmount;
             // Cập nhật ví và thêm lịch sử giao dịch
            await this.prisma.$transaction([
                this.prisma.user.update({
                    where: { id: userId },
                    data: { walletBalance: { increment: mission.rewardAmount } }
                }),
                this.prisma.transaction.create({
                    data: {
                        userId,
                        amount: mission.rewardAmount,
                        type: 'REWARD',
                        note: `Thưởng hoàn thành nhiệm vụ: ${mission.title}`
                    }
                })
            ]);
        }
        
        updatedMissions.push({
            missionId: mission.id,
            progress: newProgress,
            isCompleted
        });
     }

     return {
         message: 'Cập nhật tiến độ thành công',
         totalReward,
         updatedMissions
     };
  }
}
