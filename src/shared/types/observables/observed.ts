import { Observable } from 'rxjs'

type Observed<T> = T extends Observable<infer Type> ? Type : never

export default Observed
