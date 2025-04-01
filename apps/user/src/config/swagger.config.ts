import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = (serviceName: string) => {
    return new DocumentBuilder()
        .addBearerAuth()
        .setTitle(`${serviceName.toUpperCase()} API`)
        .setDescription(`API documentation for ${serviceName}`)
        .setVersion(process.env.CONFIG_BUILD_NUMBER || '1.0.0')
        .build();
};
