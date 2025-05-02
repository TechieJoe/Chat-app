// src/root.controller.ts
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller('chat')
export class RootController {
  @Get()
  getChatPage(@Res() res: Response) {
    return res.sendFile(
      join(__dirname, '..', '..', 'public', 'index.html'),
    );
  }
}
