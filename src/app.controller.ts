import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

//test
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
