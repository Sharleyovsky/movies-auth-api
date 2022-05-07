import { Controller, Get, HttpStatus } from "@nestjs/common";
import {
    HealthCheck,
    HealthCheckService,
    MongooseHealthIndicator,
} from "@nestjs/terminus";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("health")
@Controller("health")
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly db: MongooseHealthIndicator,
    ) {}

    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Returns health check result",
    })
    @HealthCheck()
    check() {
        return this.health.check([() => this.db.pingCheck("database")]);
    }
}
