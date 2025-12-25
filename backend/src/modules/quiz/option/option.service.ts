import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CreateOptionDto, UpdateOptionDto } from "./dto/create-option.dto";

@Injectable()
export class OptionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOptionDto) {
    const { text, isCorrect, questionId } = dto;
    return this.prisma.option.create({
      data: { text, isCorrect, questionId },
    });
  }

  async findAll() {
    return this.prisma.option.findMany({ include: { question: true } });
  }

  async findByQuestionId(questionId: number) {
    return this.prisma.option.findMany({ where: { questionId } });
  }

  async findOne(id: number) {
    const option = await this.prisma.option.findUnique({ where: { id } });
    if (!option) throw new NotFoundException("Option not found");
    return option;
  }

  async update(id: number, dto: UpdateOptionDto) {
    const option = await this.prisma.option.findUnique({ where: { id } });
    if (!option) throw new NotFoundException("Option not found");

    return this.prisma.option.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const option = await this.prisma.option.findUnique({ where: { id } });
    if (!option) throw new NotFoundException("Option not found");

    return this.prisma.option.delete({ where: { id } });
  }
}
