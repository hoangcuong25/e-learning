import { Module } from "@nestjs/common";
import { DiscountCampaignController } from "./discount-campaign.controller";
import { DiscountCampaignService } from "./discount-campaign.service";

@Module({
  controllers: [DiscountCampaignController],
  providers: [DiscountCampaignService],
})
export class DiscountCampaignModule {}
