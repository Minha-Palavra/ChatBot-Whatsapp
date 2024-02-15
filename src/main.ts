import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ApiConfigService } from './shared/api-config.service';
import { SharedModule } from './shared/shared.module';

async function setupGlobalFilters(app: INestApplication) {
  // TODO: Understand and configure the global filters.
  // app.useGlobalFilters(
  //       new HttpExceptionFilter(reflector),
  //       new QueryFailedFilter(reflector),
  // );
}

async function setupGlobalInterceptors(app: INestApplication) {
  // TODO: Understand and configure the global interceptors.
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
}

async function setupGlobalPipes(app: INestApplication) {
  // TODO: Understand and configure the global pipes.
  // app.useGlobalPipes(
  //   new ValidationPipe(
  //   {
  //     whitelist: true,
  //     errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //     transform: true,
  //     dismissDefaultMessages: false,
  //     exceptionFactory: (errors) => new UnprocessableEntityException(errors),
  //   }
  //   ),
  // );
}

async function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Minha Palavra Chatbot API')
    .setDescription('')
    .setVersion('1.0.0')
    // .addTag('chatbot')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('documentation', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  // const logger = new Logger();
  const configService = app.select(SharedModule).get(ApiConfigService);

  // TODO: Use the port from the configuration.

  // TODO: Enable CORS based on configuration.
  // await setupGlobalFilters(app);
  // await setupGlobalInterceptors(app);
  // await setupGlobalPipes(app);

  if (configService.isDocumentationEnabled) {
    await setupSwagger(app);
  }

  // app.use(helmet());
  // app.use(csurf());
  // app.use(
  //     rateLimit({
  //       windowMs: 15 * 60 * 1000, // 15 minutes
  //       max: 100, // limit each IP to 100 requests per windowMs
  //     }),
  // );
  // app.use(compression());
  // app.use(morgan('combined'));
  // app.enableVersioning();

  if (!configService.isDevelopment) {
    app.enableShutdownHooks();
  }

  const port = configService.appConfig.port;

  await app.listen(port);

  console.info(
    `Minha Palavra Chatbot API server started successfully on port ${port}.`,
  );

  console.info(
    `Documentation available at http://localhost:${port}/documentation.`,
  );
}

bootstrap();
