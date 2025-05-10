import { Container } from "inversify"
import { BookRepository } from "./interfaces";

const container = new Container();

container.bind(BookRepository).toSelf()

export { container }