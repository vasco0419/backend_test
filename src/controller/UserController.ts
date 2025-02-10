import { Request, Response } from "express";
import BaseController from "./BaseController";
import User from "../models/User";
import Post from "../models/Post";
import Comment from "../models/Comment";

export default class UserController extends BaseController {
    public async getUserInfo(req: Request, res: Response) {
        if(req["role"] !== "user") {
            res.status(400).send({ message: 'Invalid token' });
            return;
        }

        const id = req["id"];
        try {
            const userInfo = await User.findOne({ where: { id: id } });
            res.send(userInfo);
        } catch {
            res.status(500).send({ message: "Interal server error"});
        }
    }

    public async savePost(req: Request, res: Response) {
        if(req.method.toLowerCase() != "post") {
            return res.status(500).send({ message: 'Reject method' });
        }

        if(req["role"] !== "user") {
            res.status(400).send({ message: 'Invalid token' });
            return;
        }

        const id = req["id"];
        const post_id = req.body["post_id"];
        const title = req.body["title"];
        const description = req.body["description"];
        const fileName = req.body["fileName"];

        try {
            const post = await Post.findOne({ where: { id: post_id } });
            if(post==null) {
                await Post.create({
                    user_id: id,
                    title: title,
                    description: description,
                    recommend: 0,
                    image_path: fileName
                });
            } else {
                post.title = title;
                post.description = description;
                if(fileName != "")
                    post.image_path = fileName;
                
                post.update([]);
                post.save();
            }
            res.send({ message: 'success' });
        } catch {
            res.status(500).send({ message: "Interal server error"});
        }
    }

    public async getPostList(req: Request, res: Response) {
        if(req["role"] !== "user") {
            res.status(400).send({ message: 'Invalid token' });
            return;
        }

        const sql = `SELECT tbl_a.*, tbl_b.name AS user_name FROM tbl_post AS tbl_a LEFT JOIN tbl_user AS tbl_b ON tbl_a.user_id = tbl_b.id`;
        try {
            const postList = await this.m_entity.selectQueryList(sql);
            res.send(postList);
        } catch {
            res.status(500).send({ message: "Interal server error"});
        }
    }

    public async getPostInfo(req: Request, res: Response) {
        if(req["role"] !== "user") {
            res.status(400).send({ message: 'Invalid token' });
            return;
        }
        const user_id = req["id"];
        const post_id = req.query["post_id"];

        const sql = `SELECT tbl_a.*, tbl_b.name AS user_name FROM tbl_post AS tbl_a LEFT JOIN tbl_user AS tbl_b ON tbl_a.user_id = tbl_b.id WHERE tbl_a.id = ${post_id}`;
        try {
            const post = await this.m_entity.selectQueryInfo(sql);
            res.send(post);
        } catch {
            res.status(500).send({ message: "Interal server error"});
        }
    }

    public async setPostRead(req: Request, res: Response) {
        if(req["role"] !== "user") {
            res.status(400).send({ message: 'Invalid token' });
            return;
        }
        const user_id = req["id"];
        const post_id = req.query["post_id"];
        
        try {
            const post = await Post.findOne({ where: { id: post_id } });
            if(post != null && post.user_id != user_id) {
                if(post.read_users == null || post.read_users.includes(`[${user_id}]`) == false) {
                    if(post.read_users==null)
                        post.read_users = "";
                    post.read_count++;
                    post.read_users = post.read_users + `[${user_id}]`;

                    await post.update(["read_count", "read_users"]);
                    await post.save();
                }
            }
            res.send(post);
        } catch(error) {
            res.status(500).send({ message: "Interal server error"});
        }
    }

    public async setPostRecommend(req: Request, res: Response) {
        if(req["role"] !== "user") {
            res.status(400).send({ message: 'Invalid token' });
            return;
        }

        const user_id = req["id"];
        const post_id = req.body["post_id"];

        try {
            const post = await Post.findOne({ where: { id: post_id } });
            if(post != null) {
                if(post.recom_users != null && post.recom_users.includes(`[${user_id}]`)) {
                    post.recom_count--;
                    post.recom_users = post.recom_users.replace(`[${user_id}]`, "");
                } else {
                    if(post.recom_users==null)
                        post.recom_users = "";
                    post.recom_count++;
                    post.recom_users = post.recom_users + `[${user_id}]`;
                }
                await post.update(["recom_count", "recom_users"]);
                await post.save();
            }
    
            res.send(post);
        } catch {
            res.status(500).send({ message: "Interal server error"});
        }
    }

    public async setPostReport(req: Request, res: Response) {
        if(req["role"] !== "user") {
            res.status(400).send({ message: 'Invalid token' });
            return;
        }

        const user_id = req["id"];
        const post_id = req.body["post_id"];

        try {
            const post = await Post.findOne({ where: { id: post_id } });
            if(post != null) {
                if(post.report_users != null && post.report_users.includes(`[${user_id}]`)) {
                    post.report_count--;
                    post.report_users = post.report_users.replace(`[${user_id}]`, "");
                } else {
                    if(post.report_users==null)
                        post.report_users = "";
                    post.report_count++;
                    post.report_users = post.report_users + `[${user_id}]`;
                }
                await post.update(["report_count", "report_users"]);
                await post.save();
            }
    
            res.send(post);
        } catch {
            res.status(500).send({ message: "Interal server error"});
        }
    }

    public async deletePost(req: Request, res: Response) {
        if(req["role"] !== "user") {
            res.status(400).send({ message: 'Invalid token' });
            return;
        }

        const post_id = req.query["post_id"];

        try {
            const post = await Post.findOne({ where: { id: post_id } });
            if(post == null) {
                return res.status(401).send({ message: "Invalid post id"});
            }
            await post.destroy();
            res.send({ message: "success" });
        } catch {
            res.status(500).send({ message: "Interal server error"});
        }
    }

    public async getCommentList(req: Request, res: Response) {
        if(req["role"] !== "user") {
            res.status(400).send({ message: 'Invalid token' });
            return;
        }

        const post_id = req.query["post_id"];
        const sql = `SELECT tbl_a.*, tbl_b.name AS user_name, tbl_c.title AS post_title FROM tbl_comment AS tbl_a LEFT JOIN tbl_user AS tbl_b ON tbl_a.user_id = tbl_b.id LEFT JOIN tbl_post AS tbl_c ON tbl_a.post_id = tbl_c.id WHERE post_id = ${post_id}`;
        try {
            const postList = await this.m_entity.selectQueryList(sql);
            res.send(postList);
        } catch {
            res.status(500).send({ message: "Interal server error"});
        }
    }

    public async getCommentInfo(req: Request, res: Response) {
        if(req["role"] !== "user") {
            res.status(400).send({ message: 'Invalid token' });
            return;
        }

        const comment_id = req.query["comment_id"];
        const sql = `SELECT tbl_a.*, tbl_b.name AS user_name, tbl_c.title AS post_title FROM tbl_comment AS tbl_a LEFT JOIN tbl_user AS tbl_b ON tbl_a.user_id = tbl_b.id LEFT JOIN tbl_post AS tbl_c ON tbl_a.post_id = tbl_c.id WHERE tbl_a.id = ${comment_id}`;
        try {
            const post = await this.m_entity.selectQueryInfo(sql);
            res.send(post);
        } catch {
            res.status(500).send({ message: "Interal server error"});
        }
    }

    public async saveComment(req: Request, res: Response) {
        if(req.method.toLowerCase() != "post") {
            return res.status(500).send({ message: 'Reject method' });
        }

        if(req["role"] !== "user") {
            res.status(400).send({ message: 'Invalid token' });
            return;
        }

        const user_id = req["id"];
        const comment_id = req.body["comment_id"];
        const post_id = req.body["post_id"];
        const description = req.body["description"];

        try {
            const comment = await Comment.findOne({ where: { id: comment_id } });
            if(comment==null) {
                await Comment.create({
                    user_id: user_id,
                    post_id: post_id,
                    description: description,
                });
            } else {
                comment.description = description;
                comment.update(["description"]);
                comment.save();
            }
            res.send({ message: 'success' });
        } catch {
            res.status(500).send({ message: "Interal server error"});
        }
    }

    public async deleteComment(req: Request, res: Response) {
        if(req["role"] !== "user") {
            res.status(400).send({ message: 'Invalid token' });
            return;
        }

        const comment_id = req.query["comment_id"];

        try {
            const comment = await Comment.findOne({ where: { id: comment_id } });
            if(comment == null) {
                return res.status(401).send({ message: "Invalid comment id"});
            }
            
            await comment.destroy();
            res.send({ message: "success" });
        } catch {
            res.status(500).send({ message: "Interal server error"});
        }
    }
}