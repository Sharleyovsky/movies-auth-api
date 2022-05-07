import { Controller, Get } from "@nestjs/common";
import {
    HealthCheck,
    HealthCheckService,
    MongooseHealthIndicator,
} from "@nestjs/terminus";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("health")
@Controller("health")
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly db: MongooseHealthIndicator,
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([() => this.db.pingCheck("database")]);
    }
}
