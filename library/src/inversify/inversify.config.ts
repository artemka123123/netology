import { Container } from "inversify"
import { BookRepository } from "./interfaces.js";

const container = new Container();

container.bind(BookRepository).toSelf().inTransientScope()

export { container }