# Data Module

yarn start 
3001/api
```
@Module({
  imports: [DatabaseProviderModule],
  controllers: [],
  providers: [],
})
export class ExampleModule {}
```

```
@Controller()
export class ExampleService {
  constructor(
    @InjectRepository('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.findMany();
  }
}

```
