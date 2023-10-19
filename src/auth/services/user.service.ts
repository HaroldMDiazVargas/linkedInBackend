import { Injectable } from '@nestjs/common';
import { Observable, from, map, take } from 'rxjs';
import { User } from '../models/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ){}
    
    findUserById(id: number): Observable<User>{
        return from(
            this.userRepository.findOne({
                where:{ id },
                relations: ['feedPosts']
            })
        ).pipe(
            map((user: User) => {
                delete user.password;
                return user;
            })
        )
    }

    updateUserImageById(id: number, imagePath: string):Observable<UpdateResult> {
        return from(this.userRepository.update(id, { imagePath }));
    }

    findImageNameByUserId(id: number): Observable<string>{
        return from(this.userRepository.findOne({ where: { id } })).pipe(
            map((user: User) => {
                delete user.password;
                return user.imagePath
            })
        )
    }
}
