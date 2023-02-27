CREATE TABLE "public.user" (
	"id" serial NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"address_line1" varchar(255) NOT NULL,
	"address_line2" varchar(255),
	"city" varchar(255) NOT NULL,
	"zipcode" DECIMAL(255) NOT NULL,
	"country" varchar(255) NOT NULL,
	CONSTRAINT "user_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

-- // inseerting data 
INSERT INTO public.user(
	id, first_name, last_name, email, phone, password, address_line1, address_line2, city, zipcode, country)
	VALUES (4, 'Roni', 'Hasan', 'roni@gmail.com', '0123456', '1234', 'dhaka', 'keraniganj', 'dhaka', 1310, 'Bangladesh');
-- View user data 
SELECT id, first_name, last_name, email, phone, password, address_line1, address_line2, city, zipcode, country
	FROM public."public.user";

-- select all studets 
SELECT * FROM public.user;



CREATE TABLE "public.products" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"cat_id" integer NOT NULL,
	"brand_id" integer NOT NULL,
	"description" TEXT NOT NULL,
	"SKU" TEXT NOT NULL,
	"price" DECIMAL NOT NULL,
	"disc_price" DECIMAL NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	"quantity" DECIMAL NOT NULL,
	CONSTRAINT "products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.category" (
	"id" serial NOT NULL,
	"cat_name" char(60) NOT NULL,
	"cat_image" TEXT NOT NULL,
	CONSTRAINT "category_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.order" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"payment_id" integer NOT NULL,
	"total_price" integer NOT NULL,
	"billing_address" TEXT NOT NULL,
	"shipping_address" TEXT NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	"order_list_id" integer NOT NULL,
	"status" TEXT NOT NULL,
	CONSTRAINT "order_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.subcategory" (
	"id" serial NOT NULL,
	"cat_id" integer NOT NULL,
	"subcat_name" varchar(255) NOT NULL,
	CONSTRAINT "subcategory_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.product_variation" (
	"id" serial NOT NULL,
	"product_id" integer NOT NULL,
	"size" varchar(255) NOT NULL,
	"color" varchar(255) NOT NULL,
	CONSTRAINT "product_variation_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.payment_details" (
	"id" serial NOT NULL,
	"order_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"provider" varchar(255) NOT NULL,
	"status" varchar(255) NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	CONSTRAINT "payment_details_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.user_role" (
	"id" serial NOT NULL,
	"user_id" int NOT NULL,
	"super_admin" BOOLEAN NOT NULL,
	"admin" BOOLEAN NOT NULL,
	"customer" BOOLEAN NOT NULL,
	"seller" BOOLEAN NOT NULL,
	CONSTRAINT "user_role_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.product_images" (
	"id" serial NOT NULL,
	"product_id" integer NOT NULL,
	"image" TEXT NOT NULL,
	CONSTRAINT "product_images_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.brands" (
	"id" serial NOT NULL,
	"brand_name" char(60) NOT NULL,
	"brand_image" TEXT NOT NULL,
	CONSTRAINT "brands_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.order_list" (
	"id" serial NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"price" integer NOT NULL,
	CONSTRAINT "order_list_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.review" (
	"id" serial NOT NULL,
	"product_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"review_text" TEXT NOT NULL,
	"review_date" TIMESTAMP NOT NULL,
	CONSTRAINT "review_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "products" ADD CONSTRAINT "products_fk0" FOREIGN KEY ("cat_id") REFERENCES "category"("id");
ALTER TABLE "products" ADD CONSTRAINT "products_fk1" FOREIGN KEY ("brand_id") REFERENCES "brands"("id");


ALTER TABLE "order" ADD CONSTRAINT "order_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id");
ALTER TABLE "order" ADD CONSTRAINT "order_fk1" FOREIGN KEY ("payment_id") REFERENCES "payment_details"("id");
ALTER TABLE "order" ADD CONSTRAINT "order_fk2" FOREIGN KEY ("order_list_id") REFERENCES "order_list"("id");

ALTER TABLE "subcategory" ADD CONSTRAINT "subcategory_fk0" FOREIGN KEY ("cat_id") REFERENCES "category"("id");

ALTER TABLE "product_variation" ADD CONSTRAINT "product_variation_fk0" FOREIGN KEY ("product_id") REFERENCES "products"("id");

ALTER TABLE "payment_details" ADD CONSTRAINT "payment_details_fk0" FOREIGN KEY ("order_id") REFERENCES "order"("id");

ALTER TABLE "user_role" ADD CONSTRAINT "user_role_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id");

ALTER TABLE "product_images" ADD CONSTRAINT "product_images_fk0" FOREIGN KEY ("product_id") REFERENCES "products"("id");


ALTER TABLE "order_list" ADD CONSTRAINT "order_list_fk0" FOREIGN KEY ("order_id") REFERENCES "order"("id");
ALTER TABLE "order_list" ADD CONSTRAINT "order_list_fk1" FOREIGN KEY ("product_id") REFERENCES "products"("id");

ALTER TABLE "review" ADD CONSTRAINT "review_fk0" FOREIGN KEY ("product_id") REFERENCES "products"("id");
ALTER TABLE "review" ADD CONSTRAINT "review_fk1" FOREIGN KEY ("user_id") REFERENCES "user"("id");












