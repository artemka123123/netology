import { Injectable } from "@nestjs/common";
import {
  firstValueFrom,
  toArray,
  from,
  map,
  mergeAll,
  take,
  Observable,
} from "rxjs";
import axios from "axios";

@Injectable()
export class RxjsService {
  private readonly githubURL = "https://api.github.com/search/repositories?q=";
  private readonly gitlabURL = "https://gitlab.com/api/v4/projects?search="

  private mapGithubObject(value: any): any {

    return {
      id: value.id,
      name: value.name,
      description: value.description,

      full_name: value.full_name,
      url: value.html_url,
      owner: {
        name: value.owner.login,
        url: value.owner.html_url
      }
    }

  }

    private mapGitlabObject(value: any): any {

    return {
      id: value.id,
      name: value.name,
      description: value.description == null ? "" : value.description,

      url: value.web_url,
    }

  }

  private getGithub(text: string, count: number): Observable<any> {
    return from(axios.get(`${this.githubURL}${text}`))
      .pipe(map(((res: any) => res.data.items)), mergeAll())
      .pipe(map((res: any) => this.mapGithubObject(res)))
      .pipe(take(count));
  }

  private getGitlab(text: string, count: number): Observable<any> {

    return from(axios.get(`${this.gitlabURL}${text}`))
      .pipe(map((res: any) => {
        return res.data
      }), mergeAll())
      .pipe(map((res: any) => this.mapGitlabObject(res)))
      .pipe(take(count))

  }

  async searchRepositories(text: string, hub: string): Promise<any> {

    if (hub === "github") {
      const data$ = this.getGithub(text, 10).pipe(toArray());
      
      data$.subscribe(() => {});

      return firstValueFrom(data$);
    }

    if (hub == "gitlab") {

      const data$ = this.getGitlab(text, 10).pipe(toArray());
      
      data$.subscribe(() => {});

      return firstValueFrom(data$);

    }

    return new Promise((resolve) => {

      return resolve(
        {
          error: 404,
          message: "This hub is not found."
        }
      );
    })
  }
}
